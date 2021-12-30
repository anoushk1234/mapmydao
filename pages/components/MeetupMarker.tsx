import {
  Circle,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
  SkeletonCircle,
  ModalOverlay,
  ModalCloseButton,
  Button,
  Avatar,
} from "@chakra-ui/react";
import styled, { keyframes } from "styled-components";
import { SiGotomeeting } from "react-icons/si";
import { pulse } from "react-animations";
export default function MeetupMarker({
  openMeetupMarker,
  setOpenMeetupMarker,
  setMeetup,
  meetup,
  meetup_logo,
}: any) {
  // const anim = merge(fadeOut, fadeIn);
  const Tada = styled.div`
    animation: 3s ${keyframes`${pulse}`} infinite;
  `;
  return (
    <>
      <Tada>
        <Circle
          size="50%"
          color="blue.500"
          onClick={() => {
            setOpenMeetupMarker(true);
            setMeetup(meetup);
          }}
          borderRadius="50%"
          left="50%"
          top="50%"
        >
          {meetup_logo && meetup_logo.length > 0 ? (
            <SkeletonCircle size="sm" isLoaded={meetup_logo.length > 0}>
              <Avatar size="45px" borderRadius={50} src={meetup_logo} />
            </SkeletonCircle>
          ) : (
            <SiGotomeeting
              style={{
                color: "black",
                fontSize: "3rem",
              }}
            />
          )}
        </Circle>
      </Tada>
    </>
  );
}
