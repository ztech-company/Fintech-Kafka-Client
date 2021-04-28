const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

async function getConfig(vaultName, secretName) {
  const url = `https://${vaultName}.vault.azure.net`;
  const credential = new DefaultAzureCredential();
  const client = new SecretClient(url, credential);
  const latestSecret = await client.getSecret(secretName);
  return JSON.parse(latestSecret.value);
}

exports.getConfig = getConfig;
