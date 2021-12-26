import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  InputGroup,
  InputRightAddon,
  AvatarBadge,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { supabase } from "../../utils/supabaseClient";
import { FaWindowClose, FaLocationArrow } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import Geocode from "react-geocode";
import { toast } from "react-toastify";
import axios from "axios";
export default function UserProfileEdit({
  user,
  dao,
  setXY,
  xy,
  userID,
}: any): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [long, setLong] = useState<string>("");
  const [lat, setLat] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [acc, setAcc] = useState<string>("");
  const [role, setRole] = useState<string>("");
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  function success(pos: any) {
    var crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    setLong(crd.longitude.toString());
    setLat(crd.latitude.toString());
    setAcc(crd.accuracy.toString());
  }

  function errors(err: any) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  const uploadToCloudinary = async () => {
    const formData = new FormData();

    formData.append("file", file as any);
    formData.append("upload_preset", "public");

    const post = await axios.post(
      "https://api.cloudinary.com/v1_1/metapass/image/upload",
      formData
    );
    return post.data.secure_url;
  };
  //   useEffect(() => {
  async function sendCoordinatesToSupabase() {
    if (userID) {
      const { data, error } = await supabase
        .from("users")
        .update({
          location: {
            longitude: long,
            latitude: lat,
            accuracy: acc,
          },
        })
        .match({ user_id: userID });
      console.log(data);
      toast.success("location updated");
    }
  }
  async function getSupabaseUser() {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("user_id", userID);

    console.log(data);
    if (data[0] != null) {
      setRole(data[0].role); //ts-ignore
      setLong(data[0].location.longitude); //ts-ignore
      setLat(data[0].location.latitude); //ts-ignore
      setAcc(data[0].location.accuracy); //@ts-ignore
      setFile(data[0].pfp); //@ts-ignore
      // setXY(data[0].location.longitude, data[0].location.latitude);
      console.log(xy);
    }
  }
  async function sendRoleToSupabase(role: any) {
    const id = user?.user_metadata.provider_id;
    const { data, error } = await supabase
      .from("users")
      .update({
        role: role,
      })
      .match({ user_id: id });
    console.log(data);
    toast.success("profile updated");
  }
  async function sendPfpToSupabase(pfp: any) {
    const id = user?.user_metadata.provider_id;
    const { data, error } = await supabase
      .from("users")
      .update({
        pfp: pfp,
      })
      .match({ user_id: id });
    console.log(data);
    toast.success("pfp updated");
  }

  //     sendCoordinatesToSupabase();
  //   }, [long, lat, address, acc]);

  useEffect(() => {
    getSupabaseUser();
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success);
          } else if (result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
    } else {
      alert("Sorry Not available!");
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Stack
      spacing={4}
      w={"full"}
      maxW={"md"}
      bg={useColorModeValue("white", "gray.900")}
      border="4px solid"
      borderColor={useColorModeValue("gray.200", "gray.200")}
      rounded={"xl"}
      boxShadow={"lg"}
      p={6}
      mt={[4, 6]}
    >
      <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
        Your Profile
      </Heading>
      <FormControl id="userName">
        <FormLabel>User Icon</FormLabel>
        <Stack direction={["column", "row"]} spacing={6}>
          <Center>
            {console.log(user)}
            <Avatar
              size="xl"
              src={
                !file
                  ? user?.user_metadata != undefined
                    ? user?.user_metadata.avatar_url
                    : null
                  : file
              }
            >
              <AvatarBadge
                as={IconButton}
                size="sm"
                rounded="full"
                top="-10px"
                colorScheme="red"
                aria-label="remove Image"
                icon={<FaWindowClose />}
              />
            </Avatar>
          </Center>
          <Center w="full" maxH="min-content">
            <Input
              type="file"
              p={1}
              accept="image/*"
              onChange={(e) => {
                e.preventDefault();
                e.target.files ? setFile(e.target.files[0]) : null;
                console.log(file, "file");
              }}
            />
          </Center>
        </Stack>
      </FormControl>
      <FormControl id="userName" isRequired>
        <FormLabel>Role</FormLabel>
        <Input
          onChange={(e) => {
            setRole(e.target.value);
          }}
          placeholder={role}
          _placeholder={{ color: "gray.500" }}
          type="text"
        />
      </FormControl>
      {/* <FormControl id="email" isRequired>
        <FormLabel>Email address</FormLabel>
        <Input
          placeholder="your-email@example.com"
          _placeholder={{ color: "gray.500" }}
          type="email"
        />
      </FormControl> */}
      <FormControl id="password" isRequired>
        <FormLabel>Log your location</FormLabel>
        <Button
          leftIcon={<FaLocationArrow />}
          onClick={sendCoordinatesToSupabase}
          bg={"blue.400"}
          color={"white"}
          w="full"
          _hover={{
            bg: "blue.500",
          }}
        >
          Submit
        </Button>
      </FormControl>

      <Button
        mt={4}
        bgColor="blackAlpha.900"
        color="#fff"
        p={7}
        borderRadius={15}
        onClick={() => {
          uploadToCloudinary().then((url) => {
            sendRoleToSupabase(role);
            sendPfpToSupabase(url);
          });
        }}
      >
        Update Profile
      </Button>
    </Stack>
  );
}
