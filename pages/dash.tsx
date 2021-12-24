import { NextPage } from "next";
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/router";

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
  const router = useRouter();

  useEffect(() => {
    const user2 = supabase.auth.user();
    setUser(user2 != null ? user2 : {});
  }, []);

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
              <IconButton
                aria-label="expand"
                icon={<FiBell />}
                fontSize="sm"
                bgColor="#fff"
                borderRadius="50%"
                p="10px"
              />
              <Flex
                w={30}
                h={25}
                bgColor="#B57295"
                borderRadius="50%"
                color="#fff"
                align="center"
                justify="center"
                ml="-3"
                mt="-2"
                zIndex="100"
                fontSize="xs"
              >
                2
              </Flex>
            </Flex>
            <Heading letterSpacing="tight"></Heading>
            {/* {value == 1 && (
            <Box
              borderRadius="25px"
              mt={4}
              w="100%"
              h="200px"
              bgGradient="linear(to-t, #B57295, #29259A)"
            >
              <Flex
                p="1em"
                color="#fff"
                flexDir="column"
                h="100%"
                justify="space-between"
              >
                <Flex justify="space-between" w="100%" align="flex-start">
                  <Flex flexDir="column">
                    <Text color="gray.400">Current Balance</Text>
                    <Text fontWeight="bold" fontSize="xl">
                      $5,750.20
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <Icon mr={2} as={FiCreditCard} />
                    <Text>Rise.</Text>
                  </Flex>
                </Flex>
                <Text mb={4}>**** **** **** 1289</Text>
                <Flex align="flex-end" justify="space-between">
                  <Flex>
                    <Flex flexDir="column" mr={4}>
                      <Text textTransform="uppercase" fontSize="xs">
                        Valid Thru
                      </Text>
                      <Text fontSize="lg">12/23</Text>
                    </Flex>
                    <Flex flexDir="column">
                      <Text textTransform="uppercase" fontSize="xs">
                        CVV
                      </Text>
                      <Text fontSize="lg">***</Text>
                    </Flex>
                  </Flex>
                  <Icon as={FiCreditCard} />
                </Flex>
              </Flex>
            </Box>
          )} */}
            {/* {value == 2 && (
            <Box
              borderRadius="25px"
              mt={4}
              w="100%"
              h="200px"
              bgGradient="linear(to-t, yellow.300, blue.500)"
            >
              <Flex
                p="1em"
                color="#fff"
                flexDir="column"
                h="100%"
                justify="space-between"
              >
                <Flex justify="space-between" w="100%" align="flex-start">
                  <Flex flexDir="column">
                    <Text color="gray.400">Current Balance</Text>
                    <Text fontWeight="bold" fontSize="xl">
                      $350.00
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <Icon mr={2} as={FiCreditCard} />
                    <Text>Rise.</Text>
                  </Flex>
                </Flex>
                <Text mb={4}>**** **** **** 8956</Text>
                <Flex align="flex-end" justify="space-between">
                  <Flex>
                    <Flex flexDir="column" mr={4}>
                      <Text textTransform="uppercase" fontSize="xs">
                        Valid Thru
                      </Text>
                      <Text fontSize="lg">9/24</Text>
                    </Flex>
                    <Flex flexDir="column">
                      <Text textTransform="uppercase" fontSize="xs">
                        CVV
                      </Text>
                      <Text fontSize="lg">***</Text>
                    </Flex>
                  </Flex>
                  <Icon as={FiCreditCard} />
                </Flex>
              </Flex>
            </Box>
          )} */}
            {/* {value == 3 && (
            <Box
              borderRadius="25px"
              mt={4}
              w="100%"
              h="200px"
              bgGradient="linear(to-t, orange.300, pink.600)"
            >
              <Flex
                p="1em"
                color="#fff"
                flexDir="column"
                h="100%"
                justify="space-between"
              >
                <Flex justify="space-between" w="100%" align="flex-start">
                  <Flex flexDir="column">
                    <Text color="gray.400">Current Balance</Text>
                    <Text fontWeight="bold" fontSize="xl">
                      $2,150.72
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <Icon mr={2} as={FiCreditCard} />
                    <Text>Rise.</Text>
                  </Flex>
                </Flex>
                <Text mb={4}>**** **** **** 8353</Text>
                <Flex align="flex-end" justify="space-between">
                  <Flex>
                    <Flex flexDir="column" mr={4}>
                      <Text textTransform="uppercase" fontSize="xs">
                        Valid Thru
                      </Text>
                      <Text fontSize="lg">11/22</Text>
                    </Flex>
                    <Flex flexDir="column">
                      <Text textTransform="uppercase" fontSize="xs">
                        CVV
                      </Text>
                      <Text fontSize="lg">***</Text>
                    </Flex>
                  </Flex>
                  <Icon as={FiCreditCard} />
                </Flex>
              </Flex>
            </Box>
          )} */}
            {/* <Flex justifyContent="center" mt={2}>
            <Button
              bgColor={value == 1 ? "gray.600" : "gray.400"}
              size="xs"
              mx={1}
              onClick={() => changeValue(1)}
            />
            <Button
              bgColor={value == 2 ? "gray.600" : "gray.400"}
              size="xs"
              mx={1}
              onClick={() => changeValue(2)}
            />
            <Button
              bgColor={value == 3 ? "gray.600" : "gray.400"}
              size="xs"
              mx={1}
              onClick={() => changeValue(3)}
            />
          </Flex> */}
            {/* <Flex flexDir="column" my={4}>
            <Flex justify="space-between" mb={2}>
              <Text>Balance</Text>
              <Text fontWeight="bold">$140.42</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Credit Limit</Text>
              <Text fontWeight="bold">$150.00</Text>
            </Flex>
          </Flex> */}
            {/* <Heading letterSpacing="tight" size="md" my={4}>
            Send money to
          </Heading>
          <Flex>
            <AvatarGroup size="md" max={3}>
              <Avatar src="avatar-2.jpg" />
              <Avatar src="avatar-3.jpg" />
              <Avatar src="avatar-4.jpg" />
              <Avatar src="avatar-4.jpg" />
              <Avatar src="avatar-4.jpg" />
            </AvatarGroup>
            <Avatar icon={<FiPlus />} ml={2} color="#fff" bgColor="gray.300" />
          </Flex>
          <Text color="gray" mt={10} mb={2}>
            Card number
          </Text>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<FiCreditCard color="gray.700" />}
            />
            <Input type="number" placeholder="xxxx xxxx xxxx xxxx" />
          </InputGroup>
          <Text color="gray" mt={4} mb={2}>
            Sum
          </Text>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<FiDollarSign color="gray.700" />}
            />
            <Input type="number" placeholder="130.00" />
          </InputGroup> */}
            <Button
              mt={4}
              bgColor="blackAlpha.900"
              color="#fff"
              p={7}
              borderRadius={15}
            >
              Send money
            </Button>
          </Flex>
        </Flex>
      }
    </>
  );
};

export default Dash;
