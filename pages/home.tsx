/* eslint-disable react/no-children-prop */
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
  Text,
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
  Stack,
} from "@chakra-ui/react";
import { FiHome, FiMap, FiSearch } from "react-icons/fi";

import { supabase } from "../utils/supabaseClient";
import UserProfileEdit from "../components/ProfileEdit";
declare const window: any;
import Marker from "../components/Marker";
import ReactDOM from "react-dom";

import { reverseGeocode } from "../utils/reverseGeocode";

import Meetup from "../components/Meetup";
import moment from "moment";

import { toast } from "react-toastify";
import MeetupMarker from "../components/MeetupMarker";
import MeetupList from "../components/MeetupList";
import Switcher from "../components/Switcher";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const Home: NextPage = () => {
  const mapContainerRef = useRef(null);
  const [display, changeDisplay] = useState("hide");
  const [value, changeValue] = useState(1);
  const [listTab, changeListTab] = useState("members");
  const [meetTitle, setMeetTitle] = useState("");
  const [tab, setTab] = useState("map");
  const [userID, setUserID] = useState("");
  const [supabaseID, setSupabaseID] = useState("");
  const [meetupregion, setMeetupregion] = useState("");
  const [date, setDate] = useState(undefined);
  const [meetupList, setMeetupList] = useState([]);
  const [meetup, setMeetup] = useState({
    meet_id: "",
    title: "",
    attendees: [],
    description: "",
    location: {
      region: "",
    },
  });
  const [user, setUser] = useState<any>({
    usermetadata: {
      provider_id: null,
      role: null,
      avatar_url: null,
    },
  });
  const [daoList, setDaoList] = useState<any[]>([]);
  const [attendee, setAttendee] = useState("");
  const [sideBarTab, setSideBarTab] = useState<string>("profile");
  const [dao, setDao] = useState({});
  const [session, setSession] = useState<any>(null);
  const [daoMembers, setDaoMembers] = useState([]);
  const [calldata, setCalldata] = useState(false);
  const [createMeetup, setCreateMeetup] = useState(false);

  const [openMeetupMarker, setOpenMeetupMarker] = useState(false);
  const [markerLocation, setMarkerLocation] = useState({
    lat: 0,
    lng: 0,
  });
  const [xy, setXY] = useState({
    x: -104.9876,
    y: 39.7405,
  });
  const [features, setFeatures] = useState<any>([]);
  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session as any);
    setUser(session?.user ?? null);
    setUserID(session?.user?.user_metadata?.provider_id ?? null);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session as any);
        setUser(session?.user ?? null);
        setUserID(session?.user?.user_metadata?.provider_id ?? null);
      }
    );
    // console.log(
    //   session?.provider_token,
    //   session?.access_token,
    //   "this is the session"
    // );
    return () => {
      authListener?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // supabase.auth.onAuthStateChange((_event, session) => {
    //   setSession(session as any);
    //   console.log(
    //     session?.provider_token.toString().substring(0, 6),
    //     session?.access_token.toString().substring(0, 10),
    //     "this is the onAuthStateChange session"
    //   );
    //   setUser(session?.user != null ? session?.user : {});
    // setUserID(
    //   session?.user != null ? session?.user?.user_metadata?.provider_id : ""
    // );
    // });
  }, []);

  useEffect(() => {
    const getThisUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("user_id", session?.user?.user_metadata?.provider_id);
      setSupabaseID(data ? data[0]?.id : "");
      // console.log(data);
    };
    getThisUser();
  }, [session]);

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
    getSupabaseUser();
    getDaoMembersFromSupabase();

    //console.log(daoMembers, "daomems");
  }, [userID, dao]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const sendMeetupToSupabase = async (
    long: any,
    lat: any,
    reg: any,
    url: any
  ) => {
    const { data, error }: any = await supabase.from("meetups").insert([
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
        meetup_logo: url,
      },
    ]);
    console.log(data, "meetupdata");
    data?.length > 0
      ? toast.success("Meetup Created")
      : toast.error("Something went wrong");
    setCalldata(true);
  };

  useEffect(() => {
    const getUsersDao = async () => {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("user_id", userID);
      console.log(data, "data");
      console.log(data, "userdao");
      let dao_list: any = [];
      data?.forEach((user: any) => {
        dao_list.push(user.dao);
      });
      return dao_list;
    };

    const getDaoList = async () => {
      const users_dao_list = await getUsersDao();
      console.log(users_dao_list, "users_dao_list");
      // console.log(data, "daolist get");
      users_dao_list.forEach(async (dao: any) => {
        const { data, error } = await supabase
          .from("daos")
          .select()
          .eq("uid", dao);
        //console.log(data, "daolist2");
        if (data != null && data != undefined && data.length > 0) {
          setDaoList((prevState: any) => [...prevState, data[0]]);
        }
        console.log(daoList, "daoList final");
      });
    };
    getDaoList();
  }, [userID]); // eslint-disable-next-line react-hooks/exhaustive-deps

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
  }, [dao, calldata]);

  useEffect(() => {
    console.log("dao meme use effect fored");

    daoMembers.length > 0
      ? daoMembers.forEach((member: any, index: any) => {
          if (member.location != null) {
            setFeatures((features: any) => [
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
        container: mapContainerRef.current ?? "", // container ID
        style: "mapbox://styles/mapbox/streets-v11", // style URL
        center: [x, y], // starting position
        zoom: 8, // starting zoom
      });
      map?.addControl(
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
      map?.addControl(new mapboxgl.NavigationControl(), "bottom-right");
      map?.on("moveend", async () => {
        // iterate through the feature collection and append marker to the map for each feature
        features.forEach((result: any, index: any) => {
          const { id, geometry } = result;

          // create marker node
          const markerNode = document.createElement("div");

          const findDaoMemberbyUser_id = (user_id: string) => {
            return daoMembers.find((member: any) => member.user_id === user_id);
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

          const UserbyUID: any = findDaoMemberbyUser_id(id);
          console.log(UserbyUID, "userbyUID");
          UserbyUID != undefined
            ? ReactDOM.render(
                <Marker id={id} pfp={UserbyUID.pfp ?? ""} />,
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

        const marker = new mapboxgl.Marker({
          draggable: true,
        })
          .setLngLat([Number(x) + 0.5, y])
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
          const { location, date, title, meetup_logo } = meetup;
          const { longitude, latitude, reg } = location;
          const meetupmarkerNode = document.createElement("div");
          ReactDOM.render(
            <MeetupMarker
              openMeetupMarker={openMeetupMarker}
              setOpenMeetupMarker={setOpenMeetupMarker}
              setMeetup={setMeetup}
              meetup_logo={meetup_logo}
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
      return () => map?.remove();
    }
  }, [
    xy,
    features,
    mapContainerRef.current,
    createMeetup,
    meetupList,
    tab,
    calldata,
  ]); // eslint-disable-line
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
                      src={user.user_metadata.avatar_url ?? null}
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
                <Flex align="center">
                  {/* <Button variant="ghost"> */}
                  <Heading as="h2" size="lg" letterSpacing="tight">
                    {listTab === "members" ? "Members" : "Meetups"}
                  </Heading>
                  {/* </Button> */}
                  <Button
                    outline="none"
                    _active={{
                      outline: "none",
                    }}
                    onClick={() =>
                      changeListTab(
                        listTab === "members" ? "meetups" : "members"
                      )
                    }
                    variant="ghost"
                    mx={2}
                    alignSelf="flex-end"
                  >
                    <Text fontSize="medium" as="h4" color="gray" mx={2}>
                      {listTab === "members" ? "Meetups" : "Members"}
                    </Text>
                  </Button>
                </Flex>
                {/* <IconButton aria-label="expand" icon={<FiCalendar />} /> */}
              </Flex>
              {listTab === "meetups" ? (
                <MeetupList
                  meetupList={meetupList}
                  changeDisplay={changeDisplay}
                  display={display}
                  rsvp={rsvp}
                  daoMembers={daoMembers}
                  supabaseID={supabaseID}
                />
              ) : (
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
                                      <Heading
                                        size="sm"
                                        letterSpacing="tighters"
                                      >
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
                                      <Avatar
                                        size="sm"
                                        mr={2}
                                        src={member.pfp}
                                      />
                                      <Flex flexDir="column">
                                        <Heading
                                          size="sm"
                                          letterSpacing="tight"
                                        >
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

                  <Switcher changeDisplay={changeDisplay} display={display} />
                </Flex>
              )}
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
                      const user: any = daoMembers.find(
                        (member: any) => (member.id = attendee)
                      );
                      console.log(user);
                      return (
                        <Flex key={index}>
                          <Avatar size="sm" mr={2} src={user?.pfp} />
                          <Text>{user.username ?? "Name Unavailable"}</Text>
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
                      onClick={() => {
                        //redirect to google calendar with info about the meetup
                        window.open(
                          `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${meetup.title}&location=${meetup.location.region}&details=${meetup.description}`,
                          "_blank"
                        );
                        //&dates=${meetup.start_time}/${meetup.end_time}
                      }}
                      variant="ghost"
                      ml={3}
                    >
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
                console.log(daoList, "check daolist");
                console.log(
                  daoList.find((dao: any) => dao?.uid === e.target.value)?.uid
                );
                setDao(
                  () =>
                    daoList.find((dao: any) => dao?.uid === e.target.value)?.uid
                );
                //  console.log(dao);
                return daoList.find((dao: any) => dao?.uid === e.target.value)
                  ?.uid;
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
            <Stack
              mt={4}
              direction="row"
              justify="space-around"
              py={2}
              textAlign="center"
              rounded="md"
              borderRadius={30}
              bgColor="transparent"
              borderColor="gray.200"
              border="4px solid"
            >
              <Button
                bg={sideBarTab === "profile" ? "orange.400" : "transparent"}
                _hover={{
                  bg: "white",
                  color: "black",
                }}
                borderRadius={35}
                onClick={() => {
                  setSideBarTab("profile");
                }}
              >
                Profile
              </Button>
              <Button
                bg={
                  sideBarTab === "createmeetups" ? "orange.400" : "transparent"
                }
                onClick={() => {
                  setSideBarTab("createmeetups");
                }}
                _hover={{
                  bg: "white",
                  color: "black",
                }}
                borderRadius={35}
              >
                Create Meet
              </Button>
            </Stack>
            {sideBarTab === "profile" ? (
              <UserProfileEdit
                user={user}
                dao={dao}
                setXY={setXY}
                xy={xy}
                userID={userID}
              />
            ) : (
              <Meetup
                meetupregion={meetupregion}
                setDate={setDate}
                setCreateMeetup={setCreateMeetup}
                sendMeetupToSupabase={sendMeetupToSupabase}
                date={date}
                setMeetTitle={setMeetTitle}
                markerLocation={markerLocation}
              />
            )}
          </Flex>
        </Flex>
      }
    </>
  );
};

export default Home;
