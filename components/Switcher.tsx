import { Flex, Divider, IconButton } from "@chakra-ui/react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
const Switcher = ({ changeDisplay, display }: any) => {
  return (
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
  );
};
export default Switcher;
