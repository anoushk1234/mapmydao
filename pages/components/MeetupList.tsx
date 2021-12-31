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
import { supabase } from "../../utils/supabaseClient";
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
            {meetupList.map((meetupItem: any, index: any) => {
              // const didRsvp = data?.find((item: any) => item === supabaseID);
              if (display === "show" && meetupItem?.location) {
                return (
                  <Tr key={index}>
                    <Td>
                      <Flex align="center">
                        <Avatar size="sm" mr={2} src={meetupItem.meetup_logo} />
                        <Flex flexDir="column">
                          <Heading size="sm" letterSpacing="tighters">
                            {meetupItem.title}
                          </Heading>
                        </Flex>
                      </Flex>
                    </Td>
                    <Td>
                      {meetupItem.date
                        .substring(0, 10)
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("/")}
                    </Td>
                    <Td letterSpacing="tight">
                      {meetupItem.location.region ?? "Location not updated"}
                    </Td>
                    <Td>
                      <AvatarGroup size="md" max={0}>
                        {meetupItem.attendees.map(
                          (attendee: any, index: any) => {
                            const member = daoMembers.find(
                              (member: any) => member.id === attendee
                            );

                            return (
                              <Avatar
                                key={index}
                                name={member?.username}
                                src={member?.pfp}
                              />
                            );
                          }
                        )}
                      </AvatarGroup>
                    </Td>
                    <RSVPRow
                      keyItem={index}
                      rsvp={rsvp}
                      meetupItem={meetupItem}
                      supabaseID={supabaseID}
                    />
                  </Tr>
                );
              } else {
                if (index === 0 && meetupItem?.location) {
                  return (
                    <Tr key={index}>
                      <Td>
                        <Flex align="center">
                          <Avatar
                            size="sm"
                            mr={2}
                            src={meetupItem.meetup_logo}
                          />
                          <Flex flexDir="column">
                            <Heading size="sm" letterSpacing="tight">
                              {meetupItem.title}
                            </Heading>
                          </Flex>
                        </Flex>
                      </Td>
                      <Td>
                        {" "}
                        {meetupItem.date
                          .substring(0, 10)
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("/")}
                      </Td>
                      <Td>
                        {meetupItem.location.region ?? "Location not found"}
                      </Td>
                      <Td>
                        <AvatarGroup size="md" max={0}>
                          {meetupItem.attendees.map(
                            (attendee: any, index: any) => {
                              const member = daoMembers.find(
                                (member: any) => member.id === attendee
                              );

                              return (
                                <Avatar
                                  key={index}
                                  name={member?.username}
                                  src={member?.pfp}
                                />
                              );
                            }
                          )}
                        </AvatarGroup>
                      </Td>
                      <RSVPRow
                        keyItem={index + 1000}
                        rsvp={rsvp}
                        meetupItem={meetupItem}
                        supabaseID={supabaseID}
                      />
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
