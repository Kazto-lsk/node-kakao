/*
 * Created on Sat May 02 2020
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

import { IdStore } from "../../store/store";
import { ChatUser } from "./chat-user";
import { Long } from "bson";
import { TalkClient } from "../../talk-client";
import { MemberStruct } from "../struct/member-struct";
import { PacketGetMemberRes, PacketGetMemberReq } from "../../packet/packet-get-member";
import { PacketMemberReq } from "../../packet/packet-member";

export class UserManager extends IdStore<ChatUser> {

    constructor(private client: TalkClient) {
        super();
    }

    get Client() {
        return this.client;
    }

    protected fetchValue(key: Long): ChatUser {
        return new ChatUser(this.client, key);
    }

    get(key: Long) {
        if (this.client.ClientUser.Id.equals(key)) return this.client.ClientUser;

        return super.get(key, true);
    }

    async requestMemberInfo(channelId: Long): Promise<MemberStruct[]> {
        let res = await this.client.NetworkManager.requestPacketRes<PacketGetMemberRes>(new PacketGetMemberReq(channelId));
        return res.MemberList;
    }

    async requestSpecificMemberInfo(channelId: Long, idList: Long[]): Promise<MemberStruct[]> {
        let res = await this.client.NetworkManager.requestPacketRes<PacketGetMemberRes>(new PacketMemberReq(channelId, idList));
        
        return res.MemberList;
    }

    initalizeClient() {
        this.clear();
    }

}