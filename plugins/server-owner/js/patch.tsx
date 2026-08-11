import React from "react";

import { ServerOwnerCard } from "./ui";
import { getServerOwner } from "./index";

type GuildProps = {
    guild?: {
        id?: string;
    };
    guildId?: string;
};

function ServerOwnerInfo({
    guildId,
}: {
    guildId: string;
}) {
    const owner = getServerOwner(guildId);

    if (!owner) return null;

    return (
        <ServerOwnerCard
            guildName={owner.guildName}
            ownerId={owner.ownerId}
        />
    );
}

export function installGuildInfoPatch(api: any) {
    const { getModules } = api.modules.finders;
    const { withProps } = api.modules.finders.filters;
    const { afterJSX } = api.react;

    const unsubscribe = getModules(
        withProps("GuildProfile"),
        (module: any) => {
            if (!module?.GuildProfile)
                return;

            api.cleanup(
                afterJSX(
                    module.GuildProfile,
                    (element: any) => {
                        const props: GuildProps =
                            element?.props ?? {};

                        const guildId =
                            props.guildId ??
                            props.guild?.id;

                        if (!guildId)
                            return element;

                        const children =
                            element?.props?.children;

                        if (Array.isArray(children)) {
                            children.push(
                                <ServerOwnerInfo
                                    key="revenge-server-owner"
                                    guildId={guildId}
                                />
                            );
                        }

                        return element;
                    }
                )
            );
        }
    );

    return unsubscribe;
}
