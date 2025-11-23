import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
} from "react-native";
import { LockIcon, CheckIcon, StringIcon } from "../../assets/icons";
import { Checkbox } from "../flight-hub/SharedComponents";

interface FlightPreparationModalProps {
  visible: boolean;
  onClose: () => void;
  stowage?: string;
  carrier?: string;
  equipment?: string;
}

const DRAWER_ITEMS = [
  { qty: 1, item: "DRAWER LINER 10 X 14 1/2 ATLAS" },
  { qty: 3, item: "White Wine Montenero 187ml eco" },
  { qty: 1, item: "Red Wine Montenero 187ml eco" },
];

export const FlightPreparationDetailsModal: React.FC<
  FlightPreparationModalProps
> = ({
  visible,
  onClose,
  stowage = "1202",
  carrier = "Purser Kit",
  equipment = "Canister Small Square Atlas",
}) => {
  const [isLooseItems, setIsLooseItems] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-5 py-0">
        <View className="w-[90%] max-w-[1000px] h-[85%] bg-bg-surface rounded-3xl overflow-hidden flex flex-col">
          {/* --- Header --- */}
          <View className="p-6 border-b border-border-muted">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-medium text-text-secondary">
                Flight Preparation Plan Details
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text className="text-2xl text-text-tertiary">✕</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row gap-6 flex-wrap">
              <Text className="text-sm text-text-tertiary">
                Stowage:{" "}
                <Text className="text-base text-text-secondary font-medium">
                  {stowage}
                </Text>
              </Text>
              <Text className="text-sm text-text-tertiary">
                Carrier:{" "}
                <Text className="text-base text-text-secondary font-medium">
                  {carrier}
                </Text>
              </Text>
              <Text className="text-sm text-text-tertiary">
                Equipment:{" "}
                <Text className="text-base text-text-secondary font-medium">
                  {equipment}
                </Text>
              </Text>
            </View>
          </View>

          <ScrollView
            className="flex-1 bg-bg-quaternary"
            contentContainerStyle={{ padding: 24 }}
          >
            {/* --- STATUS ROW --- */}
            <View className="flex-row bg-bg-surface rounded-xl mb-6 p-4 border border-border-muted justify-around items-center">
              {/* 1. Locked */}
              <TouchableOpacity
                className="flex-row items-center gap-3"
                onPress={() => setIsLocked(!isLocked)}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center gap-2">
                  {LockIcon ? (
                    <LockIcon width={20} height={20} />
                  ) : (
                    <Text>🔒</Text>
                  )}
                  <Text className="text-base text-text-secondary font-medium">
                    Locked
                  </Text>
                </View>
                <Checkbox checked={isLocked} onChange={setIsLocked} />
              </TouchableOpacity>

              {/* 2. Sealed */}
              <TouchableOpacity
                className="flex-row items-center gap-3"
                onPress={() => setIsSealed(!isSealed)}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center gap-2">
                  <StringIcon />
                  <Text className="text-base text-text-secondary font-medium">
                    Sealed
                  </Text>
                </View>
                <Checkbox checked={isSealed} onChange={setIsSealed} />
              </TouchableOpacity>

              {/* 3. Completed */}
              <TouchableOpacity
                className="flex-row items-center gap-3"
                onPress={() => setIsCompleted(!isCompleted)}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center gap-2">
                  <CheckIcon />
                  <Text className="text-base text-text-secondary font-medium">
                    Completed
                  </Text>
                </View>
                <Checkbox checked={isCompleted} onChange={setIsCompleted} />
              </TouchableOpacity>
            </View>

            {/* --- Main Grid --- */}
            <View className="flex-row gap-6">
              {/* Left Column: Images */}
              <View className="flex-[2] bg-bg-surface rounded-2xl p-4 flex-row gap-4">
                <View className="flex-1 items-center justify-start">
                  <Text className="text-base text-text-secondary mb-3">
                    Position in Galley
                  </Text>
                  <Image
                    source={require("../../assets/icons/preparations_details/galley0.png")}
                    className="w-full h-[300px]"
                    resizeMode="contain"
                  />
                </View>
                <View className="flex-1 items-center justify-start">
                  <Text className="text-base text-text-secondary mb-3">
                    Ultralight bluedart
                  </Text>
                  <Image
                    source={require("../../assets/icons/preparations_details/galley1.png")}
                    className="w-full h-[200px] mt-5"
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Right Column: Table */}
              <View className="flex-1">
                <View className="flex-row justify-end items-center mb-3 gap-2">
                  <Text className="text-sm text-text-tertiary">
                    Loose Items
                  </Text>
                  <Switch
                    value={isLooseItems}
                    onValueChange={setIsLooseItems}
                    trackColor={{ false: "#ccc", true: "#602AF3" }}
                  />
                </View>

                <View className="bg-bg-surface rounded-2xl border border-border-muted overflow-hidden">
                  <View className="p-4 border-b border-border-muted">
                    <Text className="text-base text-text-tertiary">
                      Selected:{" "}
                      <Text className="text-text-primary">Drawer 3</Text>
                    </Text>
                  </View>
                  <View className="flex-row bg-bg-quaternary p-3 border-b border-border-muted">
                    <Text className="flex-1 font-semibold text-text-primary text-xs">
                      Qty.
                    </Text>
                    <Text className="flex-[4] font-semibold text-text-primary text-xs">
                      Item
                    </Text>
                    <Text className="flex-1 font-semibold text-text-primary text-xs text-right">
                      Action
                    </Text>
                  </View>
                  {DRAWER_ITEMS.map((row, idx) => (
                    <View
                      key={idx}
                      className="flex-row p-3 border-b border-border-muted items-center"
                    >
                      <Text className="flex-1 text-sm text-text-secondary text-center">
                        {row.qty}
                      </Text>
                      <Text className="flex-[4] text-sm text-text-secondary">
                        {row.item}
                      </Text>
                      <View className="flex-1 items-end">
                        <View className="w-6 h-6 bg-bg-tertiary rounded justify-center items-center">
                          <Text>📷</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                  <TouchableOpacity className="m-4 bg-bg-secondary p-3 rounded-xl items-center">
                    <Text className="text-text-secondary font-medium">
                      Add Image
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* --- Footer --- */}
          <View className="p-4 border-t border-border-muted items-end">
            <TouchableOpacity
              onPress={onClose}
              className="border border-border-muted py-2.5 px-8 rounded-xl"
            >
              <Text className="text-text-secondary text-sm">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
