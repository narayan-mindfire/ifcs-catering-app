import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Pdf from "react-native-pdf";

import { PrintIcon } from "../../assets/icons";
import { log } from "../../utils/logger";

interface PdfViewerModalProps {
  visible: boolean;
  onClose: () => void;
  source: any;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  visible,
  onClose,
  source,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-5">
        <View className="w-[50%] h-[55%] bg-bg-surface rounded-xl overflow-hidden shadow-lg">
          <View className="h-[50px] bg-bg-quaternary border-b border-border-muted flex-row items-center justify-between px-4">
            <Text className="text-lg font-semibold text-text-primary">
              Preparation Label
            </Text>
            <View className="flex-row">
              <TouchableOpacity
                onPress={onClose}
                className="p-2 flex-row items-center"
              >
                <PrintIcon />
                <Text className="text-bg-button text-base font-medium">
                  {" "}
                  Print
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} className="p-2">
                <Text className="text-bg-button text-base font-medium">
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-1 justify-start items-center w-full">
            <Pdf
              source={source}
              onLoadComplete={(numberOfPages, _filePath) => {
                log.info(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, _numberOfPages) => {
                log.info(`Current page: ${page}`);
              }}
              onError={(error) => {
                log.info(error);
              }}
              onPressLink={(uri) => {
                log.info(`Link pressed: ${uri}`);
              }}
              style={{ flex: 1, width: "100%" }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
