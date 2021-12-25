import React from "react";
import { Avatar, Box, Circle } from "@chakra-ui/react";

const Marker = ({ id, pfp }: any) => (
  <Circle border="4px solid" borderColor="black">
    <Avatar
      name=""
      id={`marker-${id}`}
      className="marker"
      // border="4px solid"
      // borderColor="gray.900"
      rounded="full"
      boxSize={75}
      src={pfp}
      borderRadius={35}
    />
  </Circle>
);

export default Marker;
