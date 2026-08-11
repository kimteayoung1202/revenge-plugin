import { ServerOwnerCard } from "./ui";

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
let unsubscribe: (() => void) | undefined;

export default plugin({
    start({ modules }) {
        const { getModules } = modules.finders;
        const { withProps } = modules.finders.filters;

        unsubscribe = getModules(
            withProps<GuildStore>("getGuild", "getGuilds"),
            store => {
                GuildStore = store;

                console.log(
                    "[ServerOwner] GuildStore ready"
                );
            }
        );
    },

    stop() {
        unsubscribe?.();
        unsubscribe = undefined;
        GuildStore = undefined;
    },
});

export function getServerOwner(guildId: string) {
    const guild = GuildStore?.getGuild(guildId);

    if (!guild) return null;

    return {
        guildId: guild.id,
        guildName: guild.name ?? "Unknown Server",
        ownerId:
            guild.ownerId ??
            guild.owner_id ??
            null,
    };
}

export function ServerOwnerInfo({
    guildId,
}: {
    guildId: string;
}) {
    const owner = getServerOwner(guildId);

    if (!owner) return null;

    return ServerOwnerCard({
        guildName: owner.guildName,
        ownerId: owner.ownerId,
    });
}
