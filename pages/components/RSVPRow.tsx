import {
  Button,
  Td,
  Heading,
  AvatarGroup,
  Avatar,
  Flex,
  Tr,
  Table,
  Thead,
  Tbody,
} from "@chakra-ui/react";

import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";

const RSVPRow = ({
  keyItem,
  rsvp,
  meetupItem,
  supabaseID,
  daoMembers,
}: any) => {
  const [rsvped, setRsvped] = useState(false);

  // function SafeHydrate({ children }: any) {
  //   return (
  //     <div suppressHydrationWarning>
  //       {typeof window === "undefined" ? null : children}
  //     </div>
  //   );
  // }

  async function hasRsvped(
    supabaseID: string,
    meetupID: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from("meetups")
      .select("attendees")
      .eq("meet_id", meetupID);
    console.log(data, error);
    if (error) {
      console.log(error);
      return false;
    }
    if (data !== null && data !== undefined && data?.length > 0) {
      const attendees = data[0].attendees;
      if (attendees.includes(supabaseID)) {
        return true;
      }
    } else {
      return false;
    }

    return false;
  }

  useEffect(() => {
    async function getRsvped() {
      const rsvped = await hasRsvped(supabaseID, meetupItem?.meet_id);
      setRsvped(rsvped);
    }
    getRsvped();
  }, [supabaseID, meetupItem?.meet_id]);
  return typeof window === "undefined" ? null : (
    <Tr key={keyItem}>
      <Td>
        <Flex align="center">
          <Avatar size="sm" mr={2} src={meetupItem?.meetup_logo} />
          <Flex flexDir="column">
            <Heading size="sm" letterSpacing="tighter">
              {meetupItem?.title}
            </Heading>
          </Flex>
        </Flex>
      </Td>
      <Td>
        {meetupItem?.date
          .substring(0, 10)
          .split("T")[0]
          .split("-")
          .reverse()
          .join("/")}
      </Td>
      <Td letterSpacing="tight">
        {meetupItem?.location?.region ?? "Location not updated"}
      </Td>
      <Td>
        <AvatarGroup size="md" max={0}>
          {meetupItem?.attendees.map((attendee: any, index: any) => {
            const member = daoMembers.find(
              (member: any) => member.id === attendee
            );

            return (
              <Avatar key={index} name={member?.username} src={member?.pfp} />
            );
          })}
        </AvatarGroup>
      </Td>
      {rsvped ? (
        <Td>
          <Button colorScheme="teal" variant="outline" fontWeight={500}>
            Done!
          </Button>
        </Td>
      ) : (
        <Td>
          <Button
            colorScheme="teal"
            variant="solid"
            onClick={() => {
              rsvp(meetupItem?.meet_id);
              setRsvped(true);
            }}
            fontWeight={500}
          >
            RSVP
          </Button>
        </Td>
      )}
    </Tr>
  );
};

export default RSVPRow;
