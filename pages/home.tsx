import { NextPage } from "next";
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import mapboxgl, { Popup } from "mapbox-gl";
import { useRouter } from "next/router";
//@ts-ignore
import {
  Flex,
  Heading,
  Avatar,
  AvatarGroup,
  Text,
  Icon,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Divider,
  Link,
  Box,
  Modal,
  ModalContent,
  ModalOverlay,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
} from "@chakra-ui/react";
import {
  FiHome,
  FiPieChart,
  FiMap,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiCreditCard,
  FiSearch,
  FiBell,
} from "react-icons/fi";
import axios from "axios";
import { supabase } from "../utils/supabaseClient";
import UserProfileEdit from "./components/ProfileEdit";
declare const window: any;
import Marker from "./components/Marker";
import ReactDOM from "react-dom";
import Logo from "./components/ui/Logo";
import { reverseGeocode } from "../utils/reverseGeocode";
import PartyPopper from "./components/PartyPopper";
import Meetup from "./components/Meetup";
import moment from "moment";
import { SiGotomeeting } from "react-icons/si";
import { toast } from "react-toastify";
import MeetupMarker from "./components/MeetupMarker";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const Home: NextPage = () => {
  const mapContainerRef = useRef(null);
  const [display, changeDisplay] = useState("hide");
  const [value, changeValue] = useState(1);
  const [meetTitle, setMeetTitle] = useState("");
  const [tab, setTab] = useState("map");
  const [userID, setUserID] = useState("");
  const [supabaseID, setSupabaseID] = useState("");
  const [meetupregion, setMeetupregion] = useState("");
  const [date, setDate] = useState(undefined);
  const [meetupList, setMeetupList] = useState([]);
  const [meetup, setMeetup] = useState({
    title: "",
    attendees: [],
  });
  const [user, setUser] = useState<any>({
    usermetadata: { provider_id: "", role: "", avatar_url: "" },
  });
  const [daoList, setDaoList] = useState([]);
  const [attendee, setAttendee] = useState("");
  const [dao, setDao] = useState({});
  const [daoMembers, setDaoMembers] = useState([]);
  const [createMeetup, setCreateMeetup] = useState(false);
  const [markermeetupPopuptext, setMarkermeetupPopuptext] = useState(
    "Drop this pin where u want to host the meetup"
  );
  const [openMeetupMarker, setOpenMeetupMarker] = useState(false);
  const [markerLocation, setMarkerLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const [xy, setXY] = useState({
    x: -104.9876,
    y: 39.7405,
  });
  const [features, setFeatures] = useState<any[]>([]);
  useEffect(() => {
    const user2 = supabase.auth.user();
    // console.log(user2);
    setUser(user2 != null ? user2 : {});
    setUserID(user2 != null ? user2?.user_metadata?.provider_id : "");
    const getThisUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("user_id", user2?.user_metadata?.provider_id);
      setSupabaseID(data ? data[0]?.id : "");
      console.log(data);
    };
    getThisUser();

    // for (let index = 0; index < 1; index++) {
    //   window.location.reload();
    // }
    // const reloadCount = sessionStorage.getItem("reloadCount");
    // if (reloadCount < 1) {
    //   sessionStorage.setItem("reloadCount", String(reloadCount + 1));
    //   window.location.reload();
    // } else {
    //   sessionStorage.removeItem("reloadCount");
    // }
  }, []);

  // useEffect(() => {}, [userID]);

  useEffect(() => {
    const getSupabaseUser = async () => {
      if (user != undefined) {
        const { data, error } = await supabase
          .from("users")
          .select()
          .eq("user_id", userID);
        if (data != null && data != undefined && data.length > 0) {
          data[0] != undefined
            ? setXY({
                x: data[0].location.longitude,
                y: data[0].location.latitude,
              })
            : console.log("no data");
          console.log(data[0].dao, "dao");
          // setDao(data[0].dao);
        }
      }
    };
    async function getDaoMembersFromSupabase() {
      const { data, error } = await supabase
        .from("users")
        .select()
        .match({ dao: dao });
      //  console.log(data);
      setDaoMembers(data as any);
    }
    // getSupabaseUser().then(() => {
    //   getDaoList().then(() => {
    //     getDaoMembersFromSupabase();
    //   });
    // });
    getSupabaseUser();
    getDaoMembersFromSupabase();

    //console.log(daoMembers, "daomems");
  }, [userID, dao]);

  const sendMeetupToSupabase = async (long: any, lat: any, reg: any) => {
    const { data, error } = await supabase.from("meetups").insert([
      {
        location: {
          longitude: long,
          latitude: lat,
          region: reg,
        },
        date: moment(date).format("YYYY-MM-DD HH:mm:ss"),
        Host: supabaseID,
        attendees: [supabaseID],
        dao: dao,
        title: meetTitle,
      },
    ]);
    console.log(data, "meetupdata");
    data.length > 0
      ? toast.success("Meetup Created")
      : toast.error("Something went wrong");
  };

  useEffect(() => {
    const getDaoList = async () => {
      const { data, error } = await supabase
        .from("daos")
        .select()
        .eq("signer_id", userID);
      // console.log(data, "daolist get");
      setDaoList(data as any);
    };
    getDaoList();
  }, [userID]);

  useEffect(() => {
    const getMeetupList = async () => {
      const { data, error } = await supabase
        .from("meetups")
        .select()
        .eq("dao", dao);
      console.log(data, "meetup list");
      setMeetupList(data as any);
    };
    getMeetupList();
  }, [dao]);

  useEffect(() => {
    console.log("dao meme use effect fored");
    daoMembers.length > 0
      ? daoMembers.forEach((member, index) => {
          if (member.location != null) {
            setFeatures((features) => [
              ...features,
              {
                id: member?.user_id,
                geometry: {
                  type: "Point",
                  coordinates: [
                    member.location.longitude,
                    member.location.latitude,
                  ],
                },
              },
            ]);
          }
        })
      : console.log("no dao members in use effect");
    //console.log(features, "features");
  }, [daoMembers]); // eslint-disable-line

  const getThisUser = async (attendee: any) => {
    const { data } = await supabase.from("users").select().eq("id", attendee);
    return data != null ? data[0] : {};
  };
  const rsvp = async (meetup_id: any) => {
    const { data, error } = await supabase
      .from("meetups")
      .select("attendees")
      .eq("meet_id", Number(meetup_id));
    console.log(Number(meetup_id));

    if (
      data != null &&
      data != undefined &&
      !data[0].attendees.includes(supabaseID)
    ) {
      const { data: data2, error: error2 } = await supabase
        .from("meetups")
        .update({
          attendees: [...data[0].attendees, supabaseID.toString()],
        })
        .eq("meet_id", meetup_id);
      console.log(data2, "data2");
      toast.success("RSVP Successful");
    } else {
      toast.error("You are already RSVP'd");
    }
  };

  useEffect(() => {
    let { x, y } = xy;
    // console.log(x, y, "xy");
    if (x != undefined && y != undefined && tab === "map") {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current, // container ID
        style: "mapbox://styles/mapbox/streets-v11", // style URL
        center: [x, y], // starting position
        zoom: 8, // starting zoom
      });
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          // When active the map will receive updates to the device's location as it changes.
          trackUserLocation: true,
          // Draw an arrow next to the location dot to indicate which direction the device is heading.
          showUserHeading: true,
        })
      );
      // add navigation control (the +/- zoom buttons)
      map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
      map.on("moveend", async () => {
        // iterate through the feature collection and append marker to the map for each feature
        features.forEach((result, index) => {
          const { id, geometry } = result;

          // create marker node
          const markerNode = document.createElement("div");

          const findDaoMemberbyUser_id = (user_id: string) => {
            return daoMembers.find((member) => member.user_id === user_id);
          };
          // console.log(
          //   index,
          //   daoMembers[index]?.username,
          //   daoMembers[index]?.user_id,
          //   userID,
          //   daoMembers[index]?.location,
          //   daoMembers,
          //   features
          // );

          const UserbyUID = findDaoMemberbyUser_id(id);
          console.log(UserbyUID, "userbyUID");
          UserbyUID != undefined
            ? ReactDOM.render(
                <Marker id={id} pfp={UserbyUID?.pfp} />,
                markerNode
              )
            : console.log("no dao member");
          // add marker to map
          new mapboxgl.Marker(markerNode)
            .setLngLat(geometry.coordinates as [number, number])
            .addTo(map);
        });
      });
      if (tab === "map" && createMeetup === true) {
        const Popupnode = document.createElement("div");
        // const popup = new mapboxgl.Popup(Popupnode).setText(
        //   markermeetupPopuptext
        // );
        ReactDOM.render(
          <Text color="black">{markermeetupPopuptext}</Text>,
          Popupnode
        );
        const popup = new mapboxgl.Popup(Popupnode).setText(
          markermeetupPopuptext
        );
        const marker = new mapboxgl.Marker({
          draggable: true,
        })
          .setLngLat([Number(x) + 0.5, y])
          .setPopup(popup)
          .addTo(map);

        marker.on("dragend", async () => {
          const lngLat = marker.getLngLat();
          const reg = await reverseGeocode(lngLat.lng, lngLat.lat, true);
          setMeetupregion(reg);
          setMarkerLocation({
            lat: lngLat.lat,
            lng: lngLat.lng,
          });
          console.log(reg);
        });
      }

      if (meetupList.length > 0 && meetupList) {
        meetupList.forEach((meetup, index) => {
          const { location, date, title } = meetup;
          const { longitude, latitude, reg } = location;
          const meetupmarkerNode = document.createElement("div");
          ReactDOM.render(
            <MeetupMarker
              openMeetupMarker={openMeetupMarker}
              setOpenMeetupMarker={setOpenMeetupMarker}
              setMeetup={setMeetup}
              meetup={meetup ?? {}}
            />,
            meetupmarkerNode
          );

          new mapboxgl.Marker(meetupmarkerNode)
            .setLngLat([longitude, latitude])
            .addTo(map);
        });
      }

      // clean  up on unmount
      return () => map.remove();
    }
  }, [xy, features, mapContainerRef.current, createMeetup, meetupList]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.9.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      {
        <Flex
          h={[null, null, "100vh"]}
          maxW="2000px"
          flexDir={["column", "column", "row"]}
          overflow="hidden"
        >
          {/* Column 1 */}
          <Flex
            w={["100%", "100%", "10%", "15%", "15%"]}
            flexDir="column"
            alignItems="center"
            backgroundColor="#020202"
            color="#fff"
          >
            <Flex
              flexDir="column"
              h={[null, null, "100vh"]}
              justifyContent="space-between"
            >
              <Flex flexDir="column" as="nav">
                <Flex ml={4} mt={4} mb={4} align="center">
                  {/* <Flex flexDir="column" as="nav">
                    <Heading
                      mt={50}
                      mb={[25, 50, 100]}
                      fontSize={["2xl", "2xl", "2xl", "2xl", "2xl"]}
                      alignSelf="center"
                      letterSpacing="tight"
                    >
                      MapMyDao
                    </Heading>
                  </Flex> */}
                  {/* <Box mt="-5rem"> */}
                  {/* <Logo /> */}
                  <Link href="/">
                    <Image
                      mt="2rem"
                      maxW="100%"
                      maxH="80px"
                      src="https://res.cloudinary.com/dev-connect/image/upload/v1640589623/img/Group_2_hf5qpg.svg"
                      alt="logo"
                    />
                  </Link>
                  {/* </Box> */}
                </Flex>
                <Flex
                  flexDir={["row", "row", "column", "column", "column"]}
                  align={[
                    "center",
                    "center",
                    "center",
                    "flex-start",
                    "flex-start",
                  ]}
                  wrap={["wrap", "wrap", "nowrap", "nowrap", "nowrap"]}
                  justifyContent="center"
                  p={4}
                >
                  <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]} mb={4}>
                    {/* <Link display={["none", "none", "flex", "flex", "flex"]}>
                     
                    </Link> */}
                    <Button
                      leftIcon={<FiMap />}
                      onClick={
                        tab === "map"
                          ? () => setTab("home")
                          : () => setTab("map")
                      }
                      _hover={{ textDecor: "none" }}
                      display={["flex", "flex", "none", "flex", "flex"]}
                    >
                      <Text className="active">Map</Text>
                    </Button>
                  </Flex>
                  <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                    {/* <Link display={["none", "none", "flex", "flex", "flex"]}>
                      <Icon as={FiHome} fontSize="2xl" />
                    </Link> */}
                    <Button
                      onClick={
                        tab === "home"
                          ? () => setTab("map")
                          : () => setTab("home")
                      }
                      leftIcon={<FiHome />}
                      _hover={{ textDecor: "none" }}
                      display={["flex", "flex", "none", "flex", "flex"]}
                    >
                      <Text>Home</Text>
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
              <Flex flexDir="column" alignItems="center" mb={10} mt={5}>
                <Popover>
                  <PopoverTrigger>
                    <Avatar
                      my={2}
                      src={
                        user.user_metadata != null
                          ? user.user_metadata.avatar_url
                          : ""
                      }
                    />
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />

                      <PopoverBody>
                        <Button
                          onClick={async () => {
                            const { error } = await supabase.auth.signOut();
                            if (error) {
                              console.log(error);
                            } else {
                              window.location.pathname = "/";
                            }
                          }}
                        >
                          Logout
                        </Button>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
                <Text textAlign="center">
                  {user.user_metadata != null
                    ? user.user_metadata.full_name
                    : ""}
                </Text>
              </Flex>
            </Flex>
          </Flex>

          {/* Column 2 */}
          {tab !== "map" ? (
            <Flex
              w={["100%", "100%", "60%", "60%", "55%"]}
              p="3%"
              flexDir="column"
              overflow="auto"
              minH="100vh"
            >
              <Heading fontWeight="normal" mb={4} letterSpacing="tight">
                Welcome back,{" "}
                <Flex display="inline-flex" fontWeight="bold">
                  {user.user_metadata != null ? user.user_metadata.name : ""}
                </Flex>
              </Heading>

              {/* <MyChart /> */}
              <Flex justifyContent="space-between" mt={8}>
                <Flex align="flex-end">
                  <Heading as="h2" size="lg" letterSpacing="tight">
                    Members
                  </Heading>
                  <Text fontSize="small" color="gray" ml={4}>
                    {new Date().toLocaleDateString()}
                  </Text>
                </Flex>
                <IconButton aria-label="expand" icon={<FiCalendar />} />
              </Flex>
              <Flex flexDir="column">
                <Flex overflow="auto">
                  <Table variant="unstyled" mt={4}>
                    <Thead>
                      <Tr color="gray">
                        <Th>Name of Member</Th>
                        <Th>Role</Th>
                        <Th isNumeric>Location</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {daoMembers.map((member: any, index) => {
                        if (display === "show" && member?.location) {
                          return (
                            <Tr key={index}>
                              <Td>
                                <Flex align="center">
                                  <Avatar size="sm" mr={2} src={member.pfp} />
                                  <Flex flexDir="column">
                                    <Heading size="sm" letterSpacing="tighters">
                                      {member.username}
                                    </Heading>
                                  </Flex>
                                </Flex>
                              </Td>
                              <Td>{member.role}</Td>
                              <Td letterSpacing="tight">
                                {member.location.region ??
                                  "Location not updated"}
                              </Td>
                            </Tr>
                          );
                        } else {
                          if (index === 0 && member?.location) {
                            return (
                              <Tr key={index}>
                                <Td>
                                  <Flex align="center">
                                    <Avatar size="sm" mr={2} src={member.pfp} />
                                    <Flex flexDir="column">
                                      <Heading size="sm" letterSpacing="tight">
                                        {member.username}
                                      </Heading>
                                    </Flex>
                                  </Flex>
                                </Td>
                                <Td>{member.role}</Td>
                                <Td>
                                  {member.location.region ??
                                    "Location not found"}
                                </Td>
                              </Tr>
                            );
                          }
                        }
                      })}
                    </Tbody>
                  </Table>
                </Flex>
                <Flex align="center">
                  <Divider />
                  <IconButton
                    aria-label="expand"
                    icon={
                      display == "show" ? <FiChevronUp /> : <FiChevronDown />
                    }
                    onClick={() => {
                      if (display == "show") {
                        changeDisplay("none");
                      } else {
                        changeDisplay("show");
                      }
                    }}
                  />
                  <Divider />
                </Flex>
              </Flex>
            </Flex>
          ) : (
            <>
              <Box
                className="map-container"
                boxSize="3xl"
                ref={mapContainerRef}
              ></Box>
              <Modal
                isOpen={openMeetupMarker}
                onClose={() => setOpenMeetupMarker(false)}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>{meetup.title}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Heading size="md" as="h3" mb={4}>
                      Attendees
                    </Heading>
                    {meetup?.attendees.map((attendee: any, index: number) => {
                      const user = daoMembers.find(
                        (member: any) => (member.id = attendee)
                      );
                      console.log(user);
                      return (
                        <Flex key={index}>
                          <Avatar size="sm" mr={2} src={user?.pfp} />
                          <Text>{user?.username}</Text>
                        </Flex>
                      );
                    })}
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      onClick={() => {
                        rsvp(meetup.meet_id);
                      }}
                    >
                      RSVP
                    </Button>
                    <Button
                    onClick={
                      () => {
                        //redirect to google calendar with info about the meetup
                        window.open(
                          `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${meetup.title}&dates=${meetup.start_time}/${meetup.end_time}&location=${meetup.location.region}&details=${meetup.description}`
                        , "_blank");
                    }}
                    
                    variant="ghost" ml={3}>
                      Add to Calendar
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
          )}
          {/* Column 3 */}
          <Flex
            w={["100%", "100%", "30%"]}
            bgColor="gray.900"
            p="3%"
            flexDir="column"
            overflow="auto"
            minW={[null, null, "300px", "300px", "400px"]}
          >
            <Flex alignContent="center">
              <InputGroup
                bgColor="#fff"
                mb={4}
                border="none"
                borderColor="#fff"
                borderRadius="10px"
                mr={2}
              >
                <InputLeftElement
                  pointerEvents="none"
                  children={<FiSearch color="gray" />}
                />
                <Input type="number" placeholder="Search" borderRadius="10px" />
              </InputGroup>
            </Flex>
            <Heading letterSpacing="tight" p={2} as="h3">
              Select a Dao
            </Heading>

            {/* <Heading letterSpacing="tight" size="md" my={4}>
              Your Profile
            </Heading> */}
            <Select
              placeholder="Select a Dao"
              onChange={(e) => {
                // console.log(typeof e.target.value);
                console.log(
                  daoList.find((dao) => dao.uid === e.target.value)?.uid
                );
                setDao(
                  () => daoList.find((dao) => dao.uid === e.target.value)?.uid
                );
                //  console.log(dao);
                return daoList.find((dao) => dao.uid === e.target.value)?.uid;
              }}
            >
              {/* {dao.length > 1 ? console.log(dao) : null} */}

              {daoList && daoList.length > 0 ? (
                daoList.map((daoitem: any, index) => (
                  <option key={index} value={daoitem?.uid}>
                    {daoitem?.name}
                    {console.log(daoitem)}
                  </option>
                ))
              ) : (
                <></>
              )}
            </Select>
            <UserProfileEdit
              user={user}
              dao={dao}
              setXY={setXY}
              xy={xy}
              userID={userID}
            />
            <Meetup
              meetupregion={meetupregion}
              setDate={setDate}
              setCreateMeetup={setCreateMeetup}
              sendMeetupToSupabase={sendMeetupToSupabase}
              date={date}
              setMeetTitle={setMeetTitle}
              markerLocation={markerLocation}
            />
          </Flex>
        </Flex>
      }
    </>
  );
};

export default Home;
