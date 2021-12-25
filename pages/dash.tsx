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
declare const window: any;
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
const Dash: NextPage = () => {
  const mapContainerRef = useRef(null);
  const [display, changeDisplay] = useState("hide");
  const [value, changeValue] = useState(1);
  const [tab, setTab] = useState("map");
  const [user, setUser] = useState({});
  const [daoList, setDaoList] = useState([]);
  const [dao, setDao] = useState({});
  const [daoMembers, setDaoMembers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const user2 = supabase.auth.user();
    console.log(user2);
    setUser(user2 != null ? user2 : {});
  });
  //@ts-ignore
  useEffect(() => {
    async function getUserDaosFromSupabase() {
      const { data, error } = await supabase
        .from("daos")
        .select()
        .eq(
          "signer_id",

          user.user_metadata != undefined ? user.user_metadata.provider_id : ""
        );
      if (error) {
        console.log(error);
      }
      console.log(data.length > 0 ? data[0].uid : {});
      data.length > 0 ? setDaoList(data) : null;
    }
    getUserDaosFromSupabase();
  }, [user]);

  useEffect(() => {
    async function getDaoMembersFromSupabase() {
      // dao ? console.log(dao) : console.log("no dao");
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("dao", dao);
      if (error) {
        console.log(error);
      }
      console.log(data);
      setDaoMembers(data as any);
    }
    dao ? getDaoMembersFromSupabase() : null;
  }, [dao, user]);
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current || "map",
      // See style options here: https://docs.mapbox.com/api/maps/#styles
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-104.9876, 39.7405],
      zoom: 12.5,
    }) as any;

    // add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    // clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
                <Heading
                  mt={50}
                  mb={[25, 50, 100]}
                  fontSize={["4xl", "4xl", "2xl", "3xl", "4xl"]}
                  alignSelf="center"
                  letterSpacing="tight"
                >
                  MapMyDao
                </Heading>
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
                >
                  <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]} mb={4}>
                    <Link display={["none", "none", "flex", "flex", "flex"]}>
                      <Icon as={FiMap} fontSize="2xl" className="active-icon" />
                    </Link>
                    <Link
                      _hover={{ textDecor: "none" }}
                      display={["flex", "flex", "none", "flex", "flex"]}
                    >
                      <Text className="active">Map</Text>
                    </Link>
                  </Flex>
                  <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                    <Link display={["none", "none", "flex", "flex", "flex"]}>
                      <Icon as={FiHome} fontSize="2xl" />
                    </Link>
                    <Link
                      _hover={{ textDecor: "none" }}
                      display={["flex", "flex", "none", "flex", "flex"]}
                    >
                      <Text>Normal View</Text>
                    </Link>
                  </Flex>
                </Flex>
              </Flex>
              <Flex flexDir="column" alignItems="center" mb={10} mt={5}>
                <Avatar
                  my={2}
                  src={
                    user.user_metadata != null
                      ? user.user_metadata.avatar_url
                      : ""
                  }
                />
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
                    Apr 2021
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
                      <Tr>
                        <Td>
                          <Flex align="center">
                            <Avatar size="sm" mr={2} src="amazon.jpeg" />
                            <Flex flexDir="column">
                              <Heading size="sm" letterSpacing="tight">
                                Amazon
                              </Heading>
                              <Text fontSize="sm" color="gray">
                                Apr 24, 2021 at 1:40pm
                              </Text>
                            </Flex>
                          </Flex>
                        </Td>
                        <Td>Electronic Devices</Td>
                        <Td isNumeric>+$2</Td>
                        <Td isNumeric>
                          <Text fontWeight="bold" display="inline-table">
                            -$242
                          </Text>
                          .00
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Flex align="center">
                            <Avatar size="sm" mr={2} src="starbucks.png" />
                            <Flex flexDir="column">
                              <Heading size="sm" letterSpacing="tight">
                                Starbucks
                              </Heading>
                              <Text fontSize="sm" color="gray">
                                Apr 22, 2021 at 2:43pm
                              </Text>
                            </Flex>
                          </Flex>
                        </Td>
                        <Td>Cafe and restaurant</Td>
                        <Td isNumeric>+$23</Td>
                        <Td isNumeric>
                          <Text fontWeight="bold" display="inline-table">
                            -$32
                          </Text>
                          .00
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>
                          <Flex align="center">
                            <Avatar size="sm" mr={2} src="youtube.png" />
                            <Flex flexDir="column">
                              <Heading size="sm" letterSpacing="tight">
                                YouTube
                              </Heading>
                              <Text fontSize="sm" color="gray">
                                Apr 13, 2021 at 11:23am
                              </Text>
                            </Flex>
                          </Flex>
                        </Td>
                        <Td>Social Media</Td>
                        <Td isNumeric>+$4</Td>
                        <Td isNumeric>
                          <Text fontWeight="bold" display="inline-table">
                            -$112
                          </Text>
                          .00
                        </Td>
                      </Tr>
                      {display == "show" && (
                        <>
                          <Tr>
                            <Td>
                              <Flex align="center">
                                <Avatar size="sm" mr={2} src="amazon.jpeg" />
                                <Flex flexDir="column">
                                  <Heading size="sm" letterSpacing="tight">
                                    Amazon
                                  </Heading>
                                  <Text fontSize="sm" color="gray">
                                    Apr 12, 2021 at 9:40pm
                                  </Text>
                                </Flex>
                              </Flex>
                            </Td>
                            <Td>Electronic Devices</Td>
                            <Td isNumeric>+$2</Td>
                            <Td isNumeric>
                              <Text fontWeight="bold" display="inline-table">
                                -$242
                              </Text>
                              .00
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>
                              <Flex align="center">
                                <Avatar size="sm" mr={2} src="starbucks.png" />
                                <Flex flexDir="column">
                                  <Heading size="sm" letterSpacing="tight">
                                    Starbucks
                                  </Heading>
                                  <Text fontSize="sm" color="gray">
                                    Apr 10, 2021 at 2:10pm
                                  </Text>
                                </Flex>
                              </Flex>
                            </Td>
                            <Td>Cafe and restaurant</Td>
                            <Td isNumeric>+$23</Td>
                            <Td isNumeric>
                              <Text fontWeight="bold" display="inline-table">
                                -$32
                              </Text>
                              .00
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>
                              <Flex align="center">
                                <Avatar size="sm" mr={2} src="youtube.png" />
                                <Flex flexDir="column">
                                  <Heading size="sm" letterSpacing="tight">
                                    YouTube
                                  </Heading>
                                  <Text fontSize="sm" color="gray">
                                    Apr 7, 2021 at 9:03am
                                  </Text>
                                </Flex>
                              </Flex>
                            </Td>
                            <Td>Social Media</Td>
                            <Td isNumeric>+$4</Td>
                            <Td isNumeric>
                              <Text fontWeight="bold" display="inline-table">
                                -$112
                              </Text>
                              .00
                            </Td>
                          </Tr>
                        </>
                      )}
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
            <Heading letterSpacing="tight"></Heading>

            <Heading letterSpacing="tight" size="md" my={4}>
              Setup your Dao
            </Heading>
            <Button
              mt={4}
              bgColor="blackAlpha.900"
              color="#fff"
              p={7}
              borderRadius={15}
              onClick={() => {
                window.open(process.env.NEXT_PUBLIC_BOT_URL, "_blank");
              }}
            >
              Add the bot
            </Button>
            <Text color="gray" mt={4} mb={2}>
              Use the ~config command to register your Dao
            </Text>
            <Select
              placeholder="Select a Dao"
              onChange={(e) => {
                // console.log(typeof e.target.value);
                // console.log(e.target.value);
                setDao(e.target.value);
              }}
            >
              {/* {dao.length > 1 ? console.log(dao) : null} */}

              {daoList.length > 0 ? (
                daoList.map((daoitem, index) => (
                  <option key={index} value={daoitem.uid}>
                    {daoitem.name}
                  </option>
                ))
              ) : (
                <></>
              )}
            </Select>
          </Flex>
        </Flex>
      }
    </>
  );
};

export default Dash;
