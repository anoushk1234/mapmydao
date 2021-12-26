import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Flex,
  Image,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

export default function Hero({
  title,
  subtitle,
  image,
  ctaLink,
  ctaText,
  ...rest
}: any) {
  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "space-around", xl: "space-between" }}
      direction={{ base: "column-reverse", md: "row" }}
      wrap="no-wrap"
      minH="70vh"
      px={8}
      mb={16}
      {...rest}
    >
      <Stack
        spacing={4}
        w={{ base: "80%", md: "40%" }}
        align={["center", "center", "flex-start", "flex-start"]}
      >
        <Heading
          as="h1"
          size="xl"
          fontWeight="bold"
          color="white.200"
          textAlign={["center", "center", "left", "left"]}
        >
          {title}
        </Heading>
        <Heading
          as="h2"
          size="md"
          color="white.200"
          opacity="0.8"
          fontWeight="normal"
          lineHeight={1.5}
          textAlign={["center", "center", "left", "left"]}
        >
          {subtitle}
        </Heading>
        <Flex justify="space-between">
          <Link href={ctaLink} passHref>
            <Button
              color={["blue.500", "blue.500", "blue", "blue"]}
              bg="white"
              borderRadius="8px"
              py="4"
              px="4"
              mr={4}
              lineHeight="1"
              size="md"
            >
              {ctaText}
            </Button>
          </Link>
          {/* <Link href="/auth/register" passHref>
            <Button
              color={["blue.500", "blue.500", "blue", "blue"]}
              bg="white"
              borderRadius="8px"
              py="4"
              ml={4}
              px="4"
              lineHeight="1"
              size="md"
            >
              Register your DAO
            </Button>
          </Link> */}
        </Flex>
        {/* <Text
          fontSize="xs"
          mt={2}
          textAlign="center"
          color="white.200"
          opacity="0.6"
        >
          No credit card required.
        </Text> */}
      </Stack>
      <Box w={{ base: "80%", sm: "60%", md: "50%" }} mb={{ base: 12, md: 0 }}>
        {/* TODO: Make this change every X secs */}
        <Image
          src="https://future.a16z.com/wp-content/uploads/2021/11/DAOGovernance-Facebook-Template.jpg"
          size="100%"
          rounded="1rem"
          shadow="2xl"
          alt="DAO Governance"
        />
      </Box>
    </Flex>
  );
}

Hero.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
  ctaText: PropTypes.string,
  ctaLink: PropTypes.string,
};

Hero.defaultProps = {
  title: "React landing page with Chakra UI",
  subtitle:
    "This is the subheader section where you describe the basic benefits of your product",
  image: "https://source.unsplash.com/collection/404339/800x600",
  ctaText: "Sign into your DAO",
  ctaLink: "/signup",
};
