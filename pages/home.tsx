import { NextPage } from "next";
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import mapboxgl from "mapbox-gl";
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
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const Home: NextPage = () => {
  const mapContainerRef = useRef(null);
  const [display, changeDisplay] = useState("hide");
  const [value, changeValue] = useState(1);
  const [tab, setTab] = useState("map");
  const [userID, setUserID] = useState("");
  // const [region, setRegion] = useState([
  //   {
  //     userid: "",
  //     reg: "",
  //   },
  // ]);

  const [user, setUser] = useState<any>({
    usermetadata: { provider_id: "", role: "" },
  });
  const [daoList, setDaoList] = useState([]);
  const [dao, setDao] = useState({});
  const [daoMembers, setDaoMembers] = useState([]);
  const router = useRouter();

  const [xy, setXY] = useState({
    x: -104.9876,
    y: 39.7405,
  });
  const [features, setFeatures] = useState<any[]>([]);
  useEffect(() => {
    const user2 = supabase.auth.user();
    console.log(user2);
    setUser(user2 != null ? user2 : {});
    setUserID(user2 != null ? user2?.user_metadata?.provider_id : "");
    // for (let index = 0; index < 1; index++) {
    //   window.location.reload();
    // }
    const reloadCount = sessionStorage.getItem("reloadCount");
    if (reloadCount < 1) {
      sessionStorage.setItem("reloadCount", String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloadCount");
    }
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
      console.log(data);
      setDaoMembers(data as any);
    }
    // getSupabaseUser().then(() => {
    //   getDaoList().then(() => {
    //     getDaoMembersFromSupabase();
    //   });
    // });
    getSupabaseUser();
    getDaoMembersFromSupabase();

    console.log(daoMembers, "daomems");
  }, [userID, dao]);

  useEffect(() => {
    const getDaoList = async () => {
      const { data, error } = await supabase
        .from("daos")
        .select()
        .eq("signer_id", user?.user_metadata?.provider_id);
      console.log(data, "daolist get");
      setDaoList(data as any);
    };
    getDaoList();
  }, [user]);

  useEffect(() => {
    console.log("dao meme use effect fored");
    daoMembers.length > 0
      ? daoMembers.forEach((member, index) => {
          console.log(member);
          // index == 0
          //   ? setFeatures([
          //       {
          //         id: index + 1,
          //         geometry: {
          //           type: "Point",
          //           coordinates: [
          //             member.location.longitude,
          //             member.location.latitude,
          //           ],
          //         },
          //       },
          //     ])
          //   :
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
    console.log(features, "features");
  }, [daoMembers]); // eslint-disable-line
  useEffect(() => {
    const { x, y } = xy;
    console.log(x, y, "xy");
    if (x != undefined && y != undefined && tab === "map") {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current || "map", // container ID
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
        // get center coordinates

        // const results = {
        //   features: [
        //     {
        //       id: 1,
        //       geometry: {
        //         type: "Point",
        //         coordinates: [x, y],
        //       },
        //     },
        //   ],
        // };
        // iterate through the feature collection and append marker to the map for each feature
        features.forEach((result, index) => {
          const { id, geometry } = result;

          // create marker node
          const markerNode = document.createElement("div");
          // if (index === 0) {
          //   features.forEach((result, index) => {
          //     features.length - 1 != index
          //       ? (features[index] = features[index + 1])
          //       : null;
          //     console.log(features);
          //   });
          // }
          // console.log(features);
          // daoMembers[index].user_id != userID
          //   console.log(daoMembers);
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

      // clean  up on unmount
      return () => map.remove();
    }
  }, [xy, features, mapContainerRef.current]); // eslint-disable-line react-hooks/exhaustive-deps
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
            <Box
              className="map-container"
              boxSize="3xl"
              ref={mapContainerRef}
            ></Box>
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
            <Heading letterSpacing="tight" as="h3">
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
                console.log(dao);
                return daoList.find((dao) => dao.uid === e.target.value)?.uid;
              }}
            >
              {/* {dao.length > 1 ? console.log(dao) : null} */}

              {daoList.length > 0 ? (
                daoList.map((daoitem, index) => (
                  <option key={index} value={daoitem.uid}>
                    {daoitem.name}
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

            {/* <Text color="gray" mt={4} mb={2}>
              Use the ~config command to register your Dao
            </Text> */}
            {/* <Select
            placeholder="Select a Dao"
            onChange={(e) => {
              // console.log(typeof e.target.value);
              // console.log(e.target.value);
              setDao(e.target.value);
            }}
          >
             {dao.length > 1 ? console.log(dao) : null}

            {daoList.length > 0 ? (
              daoList.map((daoitem, index) => (
                <option key={index} value={daoitem.uid}>
                  {daoitem.name}
                </option>
              ))
            ) : (
              <></>
            )}
          </Select>  */}
          </Flex>
        </Flex>
      }
    </>
  );
};

export default Home;
