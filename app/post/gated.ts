import { signCreatePostTypedData, lensHub, splitSignature } from "../../api";

export async function createPost(
  encryptedMetadata,
  contentURI,
  accessCondition,
  profileId
) {
  // if (!postData) return
  /* we first encrypt and upload the data to IPFS */

  let gated = {
    encryptedSymmetricKey:
      encryptedMetadata.encryptionParams.providerSpecificParams.encryptionKey,
    nft: accessCondition,
  };

  /* configure the final post data containing the content URI and the gated configuration */
  const createPostRequest = {
    profileId,
    contentURI: contentURI,
    collectModule: {
      freeCollectModule: { followerOnly: true },
    },
    referenceModule: {
      followerOnlyReferenceModule: false,
    },
    gated,
  };
  const token = window.localStorage.getItem("accessToken");
  try {
    const signedResult = await signCreatePostTypedData(
      createPostRequest,
      token
    );
    const typedData = signedResult.result.typedData;
    const { v, r, s } = splitSignature(signedResult.signature);
    const tx = await lensHub.postWithSig({
      profileId: typedData.value.profileId,
      contentURI: typedData.value.contentURI,
      collectModule: typedData.value.collectModule,
      collectModuleInitData: typedData.value.collectModuleInitData,
      referenceModule: typedData.value.referenceModule,
      referenceModuleInitData: typedData.value.referenceModuleInitData,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    });
    console.log("successfully created post: tx hash", tx.hash);
  } catch (err) {
    console.log("error posting publication: ", err);
  }
}
