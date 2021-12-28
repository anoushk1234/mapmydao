import {
  Circle,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import styled, { keyframes } from "styled-components";
import { SiGotomeeting } from "react-icons/si";
import { tada } from "react-animations";
export default function MeetupMarker({
  openMeetupMarker,
  setOpenMeetupMarker,
  setMeetup,
  meetup,
}: any) {
  const Tada = styled.div`
    animation: 4s ${keyframes`${tada}`} infinite;
  `;
  return (
    <>
      <Tada>
        <Circle
          size="100px"
          color="blue.500"
          onClick={() => {
            setOpenMeetupMarker(true);
            setMeetup(meetup);
          }}
          borderRadius="50%"
          left="50%"
          top="50%"
        >
          <SiGotomeeting
            style={{
              color: "black",
              fontSize: "3rem",
            }}
          />
        </Circle>
      </Tada>
    </>
  );
}
