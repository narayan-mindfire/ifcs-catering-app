import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface FormInputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
}

export const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  ...textInputProps
}: FormInputProps<T>) => {
  return (
    <View className="mb-4">
      <Text className="text-sm text-text-secondary mb-1.5">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>

      <Controller
        control={control}
        name={name}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <TextInput
              className={`border rounded-xl p-3 text-lg text-text-primary bg-bg-surface ${
                error ? "border-red-500" : "border-border-muted"
              }`}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value as string}
              placeholderTextColor="#A09CAB"
              {...textInputProps}
            />
            {error && (
              <Text className="text-red-500 text-xs mt-1 ml-1">
                {error.message}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
};
