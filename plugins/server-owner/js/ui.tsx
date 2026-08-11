import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
    guildName: string;
    ownerId: string | null;
};

export function ServerOwnerCard({ guildName, ownerId }: Props) {
    return (
        <View
            style={{
                padding: 16,
                gap: 8,
            }}
        >
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: "700",
                }}
            >
                Server Owner
            </Text>

            <Text>
                Server: {guildName}
            </Text>

            <Text selectable>
                Owner ID: {ownerId ?? "Unknown"}
            </Text>

            <Pressable
                disabled={!ownerId}
                onPress={() => {
                    if (ownerId)
                        console.log(
                            "[ServerOwner] Owner ID:",
                            ownerId
                        );
                }}
                style={{
                    paddingVertical: 10,
                }}
            >
                <Text>
                    {ownerId ? "Show Owner ID" : "Owner unavailable"}
                </Text>
            </Pressable>
        </View>
    );
}
