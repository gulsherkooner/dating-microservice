import fetch from 'node-fetch';
import getDbxToken from './getDbxToken.js';

function sanitizeFileName(filename) {
  filename = filename.split('/').pop().split('\\').pop();
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export default async function uploadToDropbox(filename, base64Image) {
  try {
    const accessToken = await getDbxToken();
    const safeFilename = sanitizeFileName(filename);
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const fileBuffer = Buffer.from(base64Data, 'base64');

    // Step 1: Upload the file to Dropbox
    const uploadResponse = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: `/${safeFilename}`,
          mode: 'add',
          autorename: true,
          mute: false,
          strict_conflict: false,
        }),
      },
      body: fileBuffer,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Dropbox upload failed: ${errorText}`);
    }

    const metadata = await uploadResponse.json();

    // Step 2: Try to create a shared link
    let sharedLinkData;

    const sharedLinkRes = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: metadata.path_lower,
        settings: {
          requested_visibility: 'public',
        },
      }),
    });

    if (!sharedLinkRes.ok) {
      const error = await sharedLinkRes.json();
      if (error.error?.['.tag'] === 'shared_link_already_exists') {
        const existingRes = await fetch('https://api.dropboxapi.com/2/sharing/list_shared_links', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: metadata.path_lower,
            direct_only: true,
          }),
        });

        const listData = await existingRes.json();
        sharedLinkData = listData.links?.[0];
      } else {
        throw new Error("Failed to get Dropbox shared link");
      }
    } else {
      sharedLinkData = await sharedLinkRes.json();
    }

    // Step 3: Convert the shared link to dl.dropboxusercontent format
    const sharedUrl = new URL(sharedLinkData.url);
    const dlUrl = sharedUrl.hostname === "www.dropbox.com"
      ? sharedUrl.href.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "?raw=1")
      : sharedUrl.href;

    // Step 4: Return final image URL for DB
    return {
      ...metadata,
      publicUrl: dlUrl,
    };

  } catch (err) {
    console.error('Upload to Dropbox failed:', err);
    throw err;
  }
}
