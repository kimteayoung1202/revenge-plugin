import { installGuildInfoPatch } from "./patch";

type Guild = {
    id: string;
    name?: string;
    ownerId?: string;
    owner_id?: string;
};

type GuildStore = {
    getGuild(id: string): Guild | undefined;
    getGuilds(): Record<string, Guild>;
};

let GuildStore: GuildStore | undefined;

export default plugin({
    start(api) {
        const { getModules } = api.modules.finders;
        const { withProps } = api.modules.finders.filters;

        const unsubscribe = getModules(
            withProps<GuildStore>(
                "getGuild",
                "getGuilds"
            ),
            store => {
                GuildStore = store;

                console.log(
                    "[ServerOwner] GuildStore ready"
                );
            }
        );

        api.cleanup(unsubscribe);

        const unpatchGuildInfo =
            installGuildInfoPatch(api);

        api.cleanup(unpatchGuildInfo);

        console.log(
            "[ServerOwner] Plugin started"
        );
    },

    stop() {
        GuildStore = undefined;

        console.log(
            "[ServerOwner] Plugin stopped"
        );
    },
});

export function getServerOwner(
    guildId: string
) {
    const guild =
        GuildStore?.getGuild(guildId);

    if (!guild)
        return null;

    return {
        guildId: guild.id,

        guildName:
            guild.name ??
            "Unknown Server",

        ownerId:
            guild.ownerId ??
            guild.owner_id ??
            null,
    };
}
