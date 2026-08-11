import React from "react";

import { ServerOwnerInfo } from "./index";

type GuildProps = {
    guild?: {
        id?: string;
    };
    guildId?: string;
};

export function installGuildInfoPatch(api: any) {
    const { getModules } = api.modules.finders;
    const { withProps } = api.modules.finders.filters;
    const { afterJSX } = api.react;

    return getModules(
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
                            element.props?.children;

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
}
