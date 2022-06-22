require("dotenv").config();
const axios = require("axios").default;

const getToken = async (email) => {
  let token = null;

  try {
    const response = await axios.get(
      `${process.env.API_URL}/token?email=${email}`
    );
    const { data } = response;
    token = data.token;
  } catch (error) {
    console.log(error);
  }

  return token;
};

/**
 * Based on the token received, return the array of
 * of elements.
 * @param {*} token 
 * @returns 
 */
const getBlocks = async (token) => {
  let blocks = null;

  try {
    const response = await axios.get(
      `${process.env.API_URL}/blocks?token=${token}`
    );
    const { data } = response;
    blocks = data.data;
  } catch (error) {
    console.log(error);
  }

  return blocks;
};

/**
 * Returns true if the two elements receives that are sequentials between them. 
 * Otherwise, it will return false.
 * @param {*} firstBlock 
 * @param {*} lastBlock 
 * @param {*} token 
 * @returns 
 */
const isSequential = async (firstBlock, lastBlock, token) => {
  const response = await axios.post(
    `${process.env.API_URL}/check?token=${token}`,
    {
      blocks: [firstBlock, lastBlock],
    }
  );

  const { data } = response;
  return data.message;
};

/**
 * This function returns the first element which will  be 
 * useful in order to start getting and sorting the rest of them.
 * 
 * @param {*} blocks 
 * @param {*} token 
 * @returns 
 */
const getFirstElement = async (blocks, token) => {
  let sequential = false;

  for (i = 0; i < blocks.length; i++) {
    sequential = false;

    for (j = 0; j < blocks.length; j++) {
      // If it's not the current element. Then check they are sequential.
      if (j != i) {
        if (await isSequential(blocks[j], blocks[i], token)) {
          sequential = true;
        }
      }
      //  If it's sequential with some other element, then move one to the next one.
      if (sequential) {
        break;
      }
    }

    // If current element does not contains a sequential one, then it's the first one.
    if (!sequential) {
      return blocks[i];
    }
  }
};

const check = async (blocks, token) => {
  let breakOut = false;
  let firstElement = await getFirstElement(blocks, token);
  let count = 0;

  let result = [firstElement];

  while (!breakOut) {
    blocks = blocks.filter((block) => block != firstElement);

    if (blocks.length == 0) {
      breakOut = true;
    }

    if (await isSequential(firstElement, blocks[count], token)) {
      result = [...result, blocks[count]];
      firstElement = blocks[count];
      count = 0;
    } else {
      count = count + 1;
    }
  }

  return result;
};

const main = async () => {
  const email_address = 'juan.mitriatti@gmail.com';
  const token = await getToken(email_address);
  const blocks = await getBlocks(token);

  const final_response = await check(
     blocks,
     token
    );

    const respuesta = await axios.post(
        `${process.env.API_URL}/check?token=${token}`,
        {
          encoded: final_response.join(''),
        }
      );

  console.log("Is it working?", respuesta.data.message);
};

// If you uncomment the next line, then you will see how it works because 
// I'm using the call that receives the encoded parameter in order to test it.
// However, you can run npm run test and see it's also working.

// main();

module.exports = {
    check,
    getToken
};
