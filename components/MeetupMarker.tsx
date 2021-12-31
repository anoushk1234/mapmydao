import { Circle, Avatar } from "@chakra-ui/react";
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
          maxH="65px"
          maxW="65px"
          onClick={() => {
            setOpenMeetupMarker(true);
            setMeetup(meetup);
          }}
          borderRadius={50}
        >
          {meetup_logo && meetup_logo.length > 0 ? (
            <Avatar
              maxH="65px"
              maxW="65px"
              borderRadius={50}
              src={meetup_logo}
            />
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
