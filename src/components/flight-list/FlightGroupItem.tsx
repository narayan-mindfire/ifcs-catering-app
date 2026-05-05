import React, { memo, useCallback, useState } from "react";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import { Flight } from "../../types/flight";
import { FlightRow } from "./FlightRow";

interface Props {
  group: Flight[];
}

const FlightGroupItemComponent: React.FC<Props> = ({ group }) => {
  const [expanded, setExpanded] = useState(false);

  const isPaired = group.length > 1;
  const groupLength = group.length;

  const toggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const firstFlight = group[0];
  const restFlights = group.slice(1);

  const firstIsVisuallyLast = expanded ? false : true;

  return (
    <Animated.View
      layout={LinearTransition.springify(10)}
      className="mb-4 bg-bg-surface border-t border-border-secondary shadow-sm overflow-hidden"
    >
      <FlightRow
        key={firstFlight.id}
        flight={firstFlight}
        isLastInGroup={isPaired ? firstIsVisuallyLast : true}
        isFirstInGroup={true}
        isPaired={isPaired}
        flightGroup={group}
        isExpanded={expanded}
        onToggleExpand={toggleExpand}
      />

      {isPaired && expanded && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(180)}
        >
          {restFlights.map((flight, index) => {
            const isLast = index + 1 === groupLength - 1;
            return (
              <FlightRow
                key={flight.id}
                flight={flight}
                isLastInGroup={isLast}
                isFirstInGroup={false}
                isPaired={isPaired}
                flightGroup={group}
                isExpanded={true}
              />
            );
          })}
        </Animated.View>
      )}
    </Animated.View>
  );
};

export const FlightGroupItem = memo(FlightGroupItemComponent, (prev, next) => {
  if (prev.group.length !== next.group.length) return false;
  for (let i = 0; i < prev.group.length; i++) {
    if (prev.group[i].id !== next.group[i].id) return false;
    if (prev.group[i].status !== next.group[i].status) return false;
  }
  return true;
});
FlightGroupItem.displayName = "FlightGroupItem";
