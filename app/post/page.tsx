"use client";
import { getURLfromIPFS } from "@/utils";
import React, { useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import {
  AndCondition,
  OrCondition,
  FollowCondition,
  CollectCondition,
  EncryptedMetadata,
  EoaOwnership,
  Erc20TokenOwnership,
  MetadataV2,
  NftOwnership,
  ProfileOwnership,
  PublicationMainFocus,
  ContractType,
  ScalarOperator,
  LensGatedSDK,
  LensEnvironment,
} from "@lens-protocol/sdk-gated";
import { ethers } from "ethers";
import web3modal from "web3modal";
import { useActiveProfile, useActiveWallet } from "@lens-protocol/react-web";
import FileUpload from "@/components/fileUpload";

interface FormInput {
  name: string;
  venue: string;
  date: string;
  cover: string;
  price: string;
  supply: string;
}

interface PostInput {
  description: string;
  title: string;
  content: string;
  image: null | File;
}

let metadata: MetadataV2 = {
  version: "2.0.0",
  name: "name",
  description: "description",
  attributes: [],
  content: "content",
  metadata_id: "1",
  //   appId: "app_id",
  mainContentFocus: PublicationMainFocus.TextOnly,
  locale: "en",
};



const uploadMetadataHandler = async (
  data: EncryptedMetadata
): Promise<string> => {
  // Upload the encrypted metadata to your server and return a publicly accessible url
  return Promise.resolve("test");
};

export default function page() {
  const { data: wallet, loading: walletLoading } = useActiveWallet();
  const { data: profile, error, loading: profileLoading } = useActiveProfile();
  const [post, setPost] = useState("");

  const [postInput, setPostInput] = useState<PostInput>({
    description: "",
    title: '',
    content: "",
    image: null
  })

  async function formURI(formInput: FormInput) {
    const { name, venue, date, price, supply } = formInput;
    if (!name || !venue || !date || !price || !supply) return;
    const data = JSON.stringify({ name, venue, date });

    console.log("starting");
    const url = await getURLfromIPFS(data);
    console.log(url);
    return url;
  }

  if (profileLoading) return <div className="h-screen w-full flex justify-center items-center bg-black text-while text-3xl"> Loading...</div>
  //   useEffect(() => {
  //     //   formURI(formInput)
  //     // createGatedPost()
  //   }, []);

 

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!profile) return;
    event.preventDefault();
    createGatedPost(profile.id);
    console.log(post);
  }

  console.log(wallet, profile);

  return (
    <div className="p-20">
      <div className="flex w-ful mt-20 items-center text-white">
        <form onSubmit={onSubmit}>
          <FileUpload />
          <input
            minLength={5}
            maxLength={31}
            required
            value={post}
            type="text"
            //   disabled={isPending}
            onChange={(e) => {
              setPost(e.target.value);
            }}
            placeholder="Post"
            className="px-6 py-4 rounded-sm text-black mr-4"
          />

          <button
            className="bg-white text-black px-14 py-4 rounded-full"
            type="submit"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

const createGatedPost = async (profileId: string, ): Promise<void> => {
  if (!window.ethereum) return;

  const nftAccessCondition: NftOwnership = {
    contractAddress: "0x0000000000000000000000000000000000000000",
    chainID: 80001,
    contractType: ContractType.Erc721, // the type of the NFT collection, ERC721 and ERC1155 are supported
    // tokenIds: ["1", "2", "3"], // OPTIONAL - the token IDs of the NFTs that grant access to the metadata, if ommitted, owning any NFT from the collection will grant access
  };

  const modal = new web3modal({
    network: "mumbai",
    cacheProvider: true,
  });

  const connection = await modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  const sdk = await LensGatedSDK.create({
    provider: provider,
    signer: signer,
    env: LensEnvironment.Mumbai,
  });

  // this must be called anytime you change networks, exposed so you can add this to your Web3Provider event handling
  // but not necessary to call explicitly
  //   await sdk.connect({
  //     address: "0x1234123412341234123412341234123412341234", // your signer's wallet address
  //     env: LensEnvironment.Mumbai,
  //   });

  const { contentURI, encryptedMetadata } = await sdk.gated.encryptMetadata(
    metadata,
    profileId, // the signed in user's profile id
    {
      nft: nftAccessCondition,
    }, // or any other access condition object
    uploadMetadataHandler
  );
  console.log(contentURI);
  console.log(encryptedMetadata);
  // contentURI is ready to be used in the `contentURI` field of your `createPostTypedMetadata` call
  // also exposing the encrypted metadata in case you want to do something with it
  // ... create post using the Lens API ...
};
