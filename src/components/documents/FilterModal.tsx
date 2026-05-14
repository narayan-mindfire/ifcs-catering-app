import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AppButton } from "@/components/common/AppButton";
import { useDocumentStore } from "@/store/useDocumentStore";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILE_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "application/pdf", label: "PDF" },
  { value: "image/", label: "Images" },
  {
    value: "application/vnd.openxmlformats-officedocument",
    label: "Documents",
  },
  { value: "text/", label: "Text Files" },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    tagFilter,
    fileTypeFilter,
    departmentFilter,
    departments,
    setFilters,
    fetchDepartments,
  } = useDocumentStore();

  const [localTag, setLocalTag] = useState(tagFilter);
  const [localType, setLocalType] = useState(fileTypeFilter);
  const [localDept, setLocalDept] = useState(departmentFilter);

  useEffect(() => {
    if (isOpen) {
      setLocalTag(tagFilter);
      setLocalType(fileTypeFilter);
      setLocalDept(departmentFilter);
      fetchDepartments();
    }
  }, [isOpen, tagFilter, fileTypeFilter, departmentFilter, fetchDepartments]);

  const handleApply = () => {
    setFilters({
      tagFilter: localTag,
      fileTypeFilter: localType,
      departmentFilter: localDept,
    });
    onClose();
  };

  const handleReset = () => {
    setLocalTag("");
    setLocalType("all");
    setLocalDept("all");
    setFilters({
      tagFilter: "",
      fileTypeFilter: "all",
      departmentFilter: "all",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-5">
        <View className="bg-bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <View className="px-6 py-5 border-b border-border-muted flex-row justify-between items-center bg-bg-tertiary">
            <Text className="text-xl font-bold text-text-primary">Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-bg-button font-bold text-lg">Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="p-6 max-h-[500px]">
            {/* By Tag */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                By Tag
              </Text>
              <TextInput
                placeholder="e.g., test"
                value={localTag}
                onChangeText={setLocalTag}
                className="bg-bg-tertiary px-4 py-3 rounded-xl text-text-primary border border-border-muted"
                placeholderTextColor="#A09CAB"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                By File Type
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {FILE_TYPE_OPTIONS.map((option) => (
                  <AppButton
                    key={option.value}
                    title={option.label}
                    onPress={() => setLocalType(option.value)}
                    type={localType === option.value ? "accent" : "tertiary"}
                    style={{
                      borderRadius: 999,
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                    }}
                    textStyle={{
                      fontSize: 14,
                      color: "#000",
                    }}
                  />
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                By Department
              </Text>
              <View className="bg-bg-tertiary rounded-xl border border-border-muted overflow-hidden">
                <TouchableOpacity
                  onPress={() => setLocalDept("all")}
                  className={`px-4 py-3 border-b border-border-muted ${
                    localDept === "all" ? "bg-bg-accent/10" : ""
                  }`}
                >
                  <Text
                    className={`${
                      localDept === "all"
                        ? "text-bg-button font-bold"
                        : "text-text-primary"
                    }`}
                  >
                    All Departments
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setLocalDept("unassigned")}
                  className={`px-4 py-3 border-b border-border-muted ${
                    localDept === "unassigned" ? "bg-bg-accent/10" : ""
                  }`}
                >
                  <Text
                    className={`${
                      localDept === "unassigned"
                        ? "text-bg-button font-bold"
                        : "text-text-primary"
                    }`}
                  >
                    Unassigned
                  </Text>
                </TouchableOpacity>
                {departments.map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    onPress={() => setLocalDept(dept)}
                    className={`px-4 py-3 border-b border-border-muted last:border-b-0 ${
                      localDept === dept ? "bg-bg-accent/10" : ""
                    }`}
                  >
                    <Text
                      className={`${
                        localDept === dept
                          ? "text-bg-button font-bold"
                          : "text-text-primary"
                      }`}
                    >
                      {dept}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View className="p-6 bg-bg-tertiary border-t border-border-muted flex-row gap-3">
            <AppButton
              title="Reset"
              onPress={handleReset}
              type="secondary"
              style={{
                flex: 1,
                paddingVertical: 16,
                borderRadius: 16,
              }}
              textStyle={{
                fontSize: 16,
                fontWeight: "700",
                color: "#6B7280",
              }}
            />

            <AppButton
              title="Apply Filters"
              type="primary"
              onPress={handleApply}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
