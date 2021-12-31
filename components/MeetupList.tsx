import {
  Flex,
  Text,
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Heading,
  IconButton,
  Divider,
  AvatarGroup,
} from "@chakra-ui/react";
import { FiChevronUp, FiChevronDown, FiCheck } from "react-icons/fi";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import RSVPRow from "./RSVPRow";

const MeetupList = ({
  meetupList,
  changeDisplay,
  display,
  rsvp,
  daoMembers,
  supabaseID,
}: any) => {
  return (
    <Flex flexDir="column">
      <Flex overflow="hidden">
        <Table variant="unstyled" mt={4}>
          <Thead>
            <Tr color="gray">
              <Th>Meetup</Th>
              <Th isNumeric>Date</Th>
              <Th isNumeric>Location</Th>
              <Th isNumeric>Attendees</Th>
            </Tr>
          </Thead>
          <Tbody>
            {meetupList &&
              meetupList.map((meetupItem: any, index: any) => {
                // const didRsvp = data?.find((item: any) => item === supabaseID);
                if (display === "show" && meetupItem?.location) {
                  return (
                    <RSVPRow
                      keyItem={index}
                      rsvp={rsvp}
                      meetupItem={meetupItem}
                      supabaseID={supabaseID}
                      daoMembers={daoMembers}
                    />
                  );
                } else {
                  if (index === 0 && meetupItem?.location) {
                    return (
                      <RSVPRow
                        keyItem={index}
                        rsvp={rsvp}
                        meetupItem={meetupItem}
                        supabaseID={supabaseID}
                        daoMembers={daoMembers}
                      />
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
          icon={display == "show" ? <FiChevronUp /> : <FiChevronDown />}
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
  );
};

export default MeetupList;
