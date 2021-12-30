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
} from "@chakra-ui/react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

const MeetupList = ({ meetupList, changeDisplay, display }: any) => {
  return (
    <Flex flexDir="column">
      <Flex overflow="auto">
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
            {meetupList?.map((meetupItem: any, index) => {
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
