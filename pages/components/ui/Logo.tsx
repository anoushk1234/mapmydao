import React from "react";
import { Box, Text, Image } from "@chakra-ui/react";

export default function Logo(props: any) {
  return (
    <Box {...props}>
      <Image
        src="https://res.cloudinary.com/dev-connect/image/upload/v1640515580/img/Subtract_vq57xj.svg"
        alt="MapMyDAO"
        width="50px"
        height="50px"
      />
    </Box>
  );
}
