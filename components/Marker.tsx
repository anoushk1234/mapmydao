import { Avatar, Box, Circle } from "@chakra-ui/react";

const Marker = ({ id, pfp }: any) => (
  <Circle key={id} border="4px solid" borderColor="black">
    {console.log(id, pfp)}
    <Avatar
      name={"user " + id}
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
