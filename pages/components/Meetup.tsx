import { Button, Text, Flex, Heading, Input } from "@chakra-ui/react";
import PartyPopper from "./PartyPopper";
import Datetime from "react-datetime";
import React, { useState } from "react";
import Head from "next/head";
import { toast } from "react-toast";
import axios from "axios";

const Meetup = ({
  meetupregion,
  setDate,
  setCreateMeetup,
  sendMeetupToSupabase,
  date,
  setMeetTitle,
  markerLocation,
}: any) => {
  const [file, setFile] = useState<File | null>(null);
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
  return (
    <>
      {/* <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/2.14.1/react-datepicker.min.css"
        />
      </Head> */}
      {meetupregion && meetupregion.length > 0 ? (
        <Flex flexDir="column">
          <Text fontSize="medium" color="gray" mt={4} mx={2} mb={2}>
            Meetup Location
          </Text>
          <Heading m={2} letterSpacing="tight" as="h4">
            {meetupregion}
          </Heading>
          {/* <IconButton
                  maxW="1rem"
                  aria-label="expand"
                  icon={<FiCalendar />}
                > */}
          <Input
            type="text"
            placeholder="Meetup Title"
            mb={2}
            onChange={(e) => setMeetTitle(e.target.value)}
          />
          <Input
            type="file"
            p={1}
            mb={2}
            accept="image/*"
            placeholder="Upload a meetup logo"
            onChange={(e) => {
              e.preventDefault();
              e.target.files ? setFile(e.target.files[0]) : null;
              console.log(file, "file");
            }}
          />
          <Input
            type="datetime-local"
            onChange={({ target }) => {
              setDate(new Date(target.value) as any);
            }}
            value={date}
          />
          {/* <Datetime onChange={setDate} value={date} /> */}

          <Button
            colorScheme="teal"
            variant="solid"
            leftIcon={<PartyPopper />}
            m={4}
            py={2}
            onClick={() => {
              // setCreateMeetup(true);
              const { lat, lng } = markerLocation;
              uploadToCloudinary().then((url) => {
                sendMeetupToSupabase(lng, lat, meetupregion, url);
                toast.success("Meetup Created");
              });
            }}
          >
            Confirm Meetup ?
          </Button>
        </Flex>
      ) : (
        <></>
      )}
      {meetupregion && meetupregion.length > 0 ? (
        <></>
      ) : (
        <Button
          colorScheme="teal"
          variant="solid"
          leftIcon={<PartyPopper />}
          m={4}
          py={2}
          onClick={() => {
            setCreateMeetup(true);
          }}
        >
          Create Meetup
        </Button>
      )}
    </>
  );
};

export default Meetup;
