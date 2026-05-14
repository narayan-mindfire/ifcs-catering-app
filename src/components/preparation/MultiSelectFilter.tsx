import React, { useRef, useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

import { FilterIcon } from "@/assets/icons";

interface Option {
  label: string;
  icon: React.ReactNode;
}

interface MultiSelectFilterProps {
  options: Option[];
  selectedOptions: string[];
  onToggleOption: (option: string) => void;
}

export const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  options,
  selectedOptions,
  onToggleOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<View>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const toggleDropdown = () => {
    if (!isOpen) {
      dropdownRef.current?.measure((fx, fy, width, height, px, py) => {
        setPos({ top: py + height + 5, left: px, width: 250 });
        setIsOpen(true);
      });
    } else {
      setIsOpen(false);
    }
  };

  const displayText =
    selectedOptions.length === 0
      ? "Filter (All)"
      : selectedOptions.length === options.length
        ? "Filter (All)"
        : `Filter (${selectedOptions.length})`;

  return (
    <View>
      <TouchableOpacity
        ref={dropdownRef}
        onPress={toggleDropdown}
        className="flex-row items-center bg-bg-tertiary py-2.5 px-4 rounded-md mr-3"
      >
        <FilterIcon width={24} height={34} />
        <Text className="text-xl font-normal m-0.5 text-text-primary ml-2">
          {displayText}
        </Text>
      </TouchableOpacity>

      <Modal transparent visible={isOpen} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-transparent"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            className="absolute bg-bg-surface border border-border-muted rounded-lg shadow-lg max-h-[300px]"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
            }}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => {
                const isSelected = selectedOptions.includes(item.label);
                return (
                  <TouchableOpacity
                    onPress={() => onToggleOption(item.label)}
                    className={`flex-row items-center px-4 py-3 border-b border-bg-tertiary ${
                      isSelected
                        ? "bg-bg-accent border-border-accent"
                        : "bg-bg-surface"
                    }`}
                  >
                    <View className="mr-3">{item.icon}</View>
                    <Text
                      className={`text-base ${
                        isSelected
                          ? "text-text-primary font-semibold"
                          : "text-text-primary font-normal"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
