import { Button, Text, Flex, Heading, Input } from "@chakra-ui/react";
import PartyPopper from "./PartyPopper";
import Datetime from "react-datetime";
import Head from "next/head";
import { toast } from "react-toast";

const Meetup = ({
  meetupregion,
  setDate,
  setCreateMeetup,
  sendMeetupToSupabase,
  date,
  setMeetTitle,
  markerLocation,
}: any) => {
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

              sendMeetupToSupabase(lng, lat, meetupregion);
              toast.success("Meetup Created");
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
