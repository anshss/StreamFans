/* eslint-disable @next/next/no-img-element */
"use client";
import { usePathname } from "next/navigation";
import {
    useProfile,
    usePublications,
    useFollow,
    useActiveProfile,
    Profile,
    ProfileOwnedByMe,
    NotFoundError,
    useUnfollow,
} from "@lens-protocol/react-web";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { formatPicture } from "../../../utils";
import { toast } from "react-hot-toast";
import { Framework } from "@superfluid-finance/sdk-core";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import web3modal from "web3modal";


export default function Profile() {
    const { data: wallet } = useActiveProfile();
    const { isConnected } = useAccount();

    const pathName = usePathname();
    const handle = pathName?.split("/")[2];

    let { data: profile, loading } = useProfile({ handle });

    if (loading) return <p className="p-14">Loading ...</p>;

    return (
        <div>
            <div className="p-20">
                {wallet && profile && (
                    <FollowComponent
                        isConnected={isConnected}
                        profile={profile}
                        wallet={wallet}
                    />
                )}
                <div className="mt-6">
                    {profile && profile.picture?.__typename === "MediaSet" && (
                        <img
                            width="200"
                            height="200"
                            alt={profile.handle}
                            className="rounded-xl"
                            src={formatPicture(profile.picture)}
                        />
                    )}
                    <h1 className="text-3xl my-3">{profile?.handle}</h1>
                    <h3 className="text-xl mb-4">{profile?.bio}</h3>
                    {profile && <Publications profile={profile} />}
                </div>
            </div>
        </div>
    );
}

function FollowComponent({
    wallet,
    profile,
    isConnected,
}: {
    isConnected: boolean;
    profile: Profile;
    wallet: ProfileOwnedByMe;
}) {
    const { execute: follow } = useFollow({
        followee: profile,
        follower: wallet,
    });

    const { execute: unFollow } = useUnfollow({
        followee: profile,
        follower: wallet,
    });


    // -----

    const superTokenAddress = `0x96B82B65ACF7072eFEb00502F45757F254c2a0D4`;
    const [superToken, setSuperToken] = useState();

    useEffect(() => {
        sfInitialize()
    }, [])

    async function getEthersProvider() {
        const infuraKey = process.env.NEXT_PUBLIC_INFURA_KEY;
        const provider = new ethers.providers.JsonRpcProvider(
            `https://polygon-mumbai.infura.io/v3/${infuraKey}`
        );
        return provider;
    }

    async function sfInitialize() {
        const provider = await getEthersProvider();
        const xsf = await Framework.create({
            chainId: 80001,
            provider,
        });
        const sT = await xsf.loadSuperToken(superTokenAddress);
        setSuperToken(sT);

        console.log("ready");
        return sT;
    }

    const senderAddress = wallet.ownedBy;
    const recipientAddress = profile.ownedBy;
    const flowRate = `385802469135802`

    async function startFlow(xReceiverAddress, xFlowRate) {
        if (senderAddress.toUpperCase() == xReceiverAddress.toUpperCase()) return
        console.log(senderAddress, xReceiverAddress, xFlowRate);

        const xSuperToken = await sfInitialize();

        const modal = new web3modal({
            network: "mumbai",
            cacheProvider: true,
        });
        const connection = await modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const createFlowOperation = xSuperToken.createFlow({
            sender: senderAddress,
            receiver: xReceiverAddress,
            flowRate: xFlowRate,
        });

        const txnResponse = await createFlowOperation.exec(signer);
        const txnReceipt = await txnResponse.wait();
        console.log("started");
        console.log(
            `https://app.superfluid.finance/dashboard/${xReceiverAddress}`
        );
    }

    async function stopFlow(xReceiverAddress) {

        if (senderAddress?.toUpperCase() == xReceiverAddress?.toUpperCase()) return

        const modal = new web3modal({
            network: "mumbai",
            cacheProvider: true,
        });
        const connection = await modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const flowOp = superToken.deleteFlow({
            sender: senderAddress,
            receiver: xReceiverAddress,
        });

        const txnResponse = await flowOp.exec(signer);
        const txnReceipt = await txnResponse.wait();
        console.log("stopped");
    }

    async function getFlowInfo(xReceiverAddress) {
        const provider = await getEthersProvider();
        if (senderAddress == xReceiverAddress) return
        
        const flowInfo = await superToken.getFlow({
            sender: senderAddress,
            receiver: xReceiverAddress,
            providerOrSigner: provider,
        });
        console.log("flowInfo", flowInfo);
    }

        // -----

    async function followUser() {
        try {
            //start stream
            await startFlow(recipientAddress, flowRate)
            await follow();
        } catch (e) {}
    }
    async function unfollowUser() {
        try {
            //stop stream
            await stopFlow(recipientAddress)
            await unFollow();
        } catch (e) {}
    }



    function handelClick() {
        if (profile.isFollowedByMe) {
            unfollowUser();
        } else {
            followUser();
        }
    }

    console.log(wallet, profile, isConnected);
    return (
        <>
            {isConnected && (
                <button
                    className="bg-white text-black px-14 py-4 rounded-full"
                    onClick={handelClick}
                >
                    {profile.isFollowedByMe ? "UnFollow" : "Follow"}{" "}
                    {profile.handle}
                </button>
            )}
        </>
    );
}

function Publications({ profile }: { profile: Profile }) {
    let { data: publications } = usePublications({
        profileId: profile.id,
        limit: 20,
    });
    publications = publications?.map((publication) => {
        if (publication.__typename === "Mirror") {
            return publication.mirrorOf;
        } else {
            return publication;
        }
    });

    return (
        <>
            {publications?.map((pub: any, index: number) => (
                <div key={index} className="py-4 bg-zinc-900 rounded mb-3 px-4">
                    <p>{pub.metadata.content}</p>
                    {pub.metadata?.media[0]?.original &&
                        ["image/jpeg", "image/png"].includes(
                            pub.metadata?.media[0]?.original.mimeType
                        ) && (
                            <img
                                width="400"
                                height="400"
                                alt={profile.handle}
                                className="rounded-xl mt-6 mb-2"
                                src={formatPicture(pub.metadata.media[0])}
                            />
                        )}
                </div>
            ))}
        </>
    );
}
