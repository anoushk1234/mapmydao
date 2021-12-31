import { Button, Td } from "@chakra-ui/react";

import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";

const RSVPRow = ({ keyItem, rsvp, meetupItem, supabaseID }: any) => {
  const [rsvped, setRsvped] = useState(false);
  async function hasRsvped(
    supabaseID: string,
    meetupID: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from("meetups")
      .select("attendees")
      .eq("meet_id", meetupID);
    console.log(data, error);
    if (error) {
      console.log(error);
      return false;
    }
    if (data !== null && data !== undefined && data?.length > 0) {
      const attendees = data[0].attendees;
      if (attendees.includes(supabaseID)) {
        return true;
      }
    } else {
      return false;
    }

    return false;
  }

  useEffect(() => {
    async function getRsvped() {
      const rsvped = await hasRsvped(supabaseID, meetupItem.meet_id);
      setRsvped(rsvped);
    }
    getRsvped();
  }, [supabaseID, meetupItem.meet_id]);
  return rsvped ? (
    <Td key={keyItem}>
      <Button colorScheme="teal" variant="outline" fontWeight={500}>
        Done!
      </Button>
    </Td>
  ) : (
    <Td key={keyItem}>
      <Button
        colorScheme="teal"
        variant="solid"
        onClick={() => {
          rsvp(meetupItem.meet_id);
          setRsvped(true);
        }}
        fontWeight={500}
      >
        RSVP
      </Button>
    </Td>
  );
};

export default RSVPRow;
