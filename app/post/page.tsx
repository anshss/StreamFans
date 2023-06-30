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
import FileUpload from "@/components/FileUpload";
import Loader from "@/components/Loader";

interface FormInput {
  name: string;
  venue: string;
  date: string;
  cover: string;
  price: string;
  supply: string;
}

interface PostInput {
  content: string;
  image: null | File;
}

type ImageState = {
  file: File | null;
  previewURL: string | null;
  loading: boolean;
};

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

  const [image, setImage] = useState<ImageState>({
    file: null,
    previewURL: null,
    loading: false,
  });

  console.log("IMage: ", image);

  const [postInput, setPostInput] = useState<PostInput>({
    content: "",
    image: null,
  });

  async function formURI(formInput: FormInput) {
    const { name, venue, date, price, supply } = formInput;
    if (!name || !venue || !date || !price || !supply) return;
    const data = JSON.stringify({ name, venue, date });

    console.log("starting");
    const url = await getURLfromIPFS(data);
    console.log(url);
    return url;
  }

  if (profileLoading) return <Loader />;
  //   useEffect(() => {
  //     //   formURI(formInput)
  //     // createGatedPost()
  //   }, []);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    // if (!profile) return;
    // event.preventDefault();
    // createGatedPost(profile.id);
    console.log(post);
  }

  console.log(wallet, profile);

  return (
    <div className="py-20 px-20 max-w-screen-xl mx-auto">
      <div className="mt-20 text-white">
        <form onSubmit={onSubmit}>
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
              <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
                <div className="flex items-center space-x-1 sm:pr-4">
                  <FileUpload setImage={setImage} />
                </div>
              </div>
              <button
                type="button"
                data-tooltip-target="tooltip-fullscreen"
                className="p-2 text-gray-500 rounded cursor-pointer sm:ml-auto hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Full screen</span>
              </button>
              <div
                id="tooltip-fullscreen"
                role="tooltip"
                className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
              >
                Show full screen
                <div className="tooltip-arrow" data-popper-arrow="" />
              </div>
            </div>
            <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
              <label htmlFor="editor" className="sr-only">
                Publish post
              </label>
              <textarea
                id="editor"
                rows={6}
                className="block py-1 ring-0 outline-0 w-full px-0 text-md text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write an article..."
                required
                onChange={(e) => {
                  setPostInput({ ...postInput, content: e.target.value });
                }}
                value={postInput.content}
              />
            </div>
          </div>

          {image.previewURL !== null ? (
            <figure className="max-w-lg">
              <img
                className="h-auto max-w-full rounded-lg"
                src={image.previewURL}
                alt="image description"
              />
              <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                {image.file?.name}
              </figcaption>
            </figure>
          ) : null}

          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Publish post
          </button>
        </form>
      </div>
    </div>
  );
}

const createGatedPost = async (profileId: string): Promise<void> => {
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

// Example metedata:::

// text only

// {
//   "version": "2.0.0",
//   "metadata_id": "d9dca93e-56d4-4fc2-9ff6-c45a60453a03",
//   "content": "it's a text post",
//   "external_url": "https://lenster.xyz/u/akashbiswas.test",
//   "image": null,
//   "imageMimeType": null,
//   "name": "Post by @akashbiswas.test",
//   "animation_url": null,
//   "mainContentFocus": "TEXT_ONLY",
//   "attributes": [
//      {
//         "traitType": "type",
//         "displayType": "string",
//         "value": "text_only"
//      }
//   ],
//   "media": [],
//   "locale": "en-US",
//   "appId": "Lenster"
// }

// With image: \

// {
//   "version": "2.0.0",
//   "metadata_id": "ed523073-3d2a-4a5f-aeff-2a7261d847cf",
//   "content": "Hi, this is my first post. Here a image of vulture.",
//   "external_url": "https://lenster.xyz/u/akashbiswas.test",
//   "image": "ipfs://bafkreiavistwrkdfa2fo5ykbnz4bmtklxyrbqwtg4opaveafzsk6ziwxii",
//   "imageMimeType": "image/jpeg",
//   "name": "Post by @akashbiswas.test",
//   "animation_url": null,
//   "mainContentFocus": "IMAGE",
//   "attributes": [
//     {
//       "traitType": "type",
//       "displayType": "string",
//       "value": "image"
//     }
//   ],
//   "media": [
//     {
//       "item": "ipfs://bafkreiavistwrkdfa2fo5ykbnz4bmtklxyrbqwtg4opaveafzsk6ziwxii",
//       "cover": "ipfs://bafkreiavistwrkdfa2fo5ykbnz4bmtklxyrbqwtg4opaveafzsk6ziwxii",
//       "type": "image/jpeg"
//     }
//   ],
//   "locale": "en-US",
//   "appId": "Lenster"
// }
