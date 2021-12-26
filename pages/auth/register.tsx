import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { FaDiscord } from "react-icons/fa";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import signInWithDiscord from "../../utils/SignInWithDiscord";

const Login: NextPage = () => {
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Heading fontSize={"4xl"}>Register your Dao</Heading>

        <Stack spacing={4}>
          <Button
            bgColor={"#7289DA"}
            variant="solid"
            onClick={async () => {
              await signInWithDiscord("dash");
            }}
            maxW="300px"
            maxH={50}
            rightIcon={<FaDiscord />}
          >
            Sign in with Discord
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Login;
