# Escrow Release Tool by SBC

This is the release tool that many Secure Block Chains customers have been asking for. The most frequent question that we get from users of ReservoiorLite and Harbor is "What happens to my escrow if SBC shuts down"? The answer is simple. Your escrow is stored safe on the XRP ledger and nothing would happen if we were to cease operations. The next question is "How do I release my escrow without you"? To which we really didnt have a good answer as none of the existing tools we know of allow the use of cryptoconditions.

Today that has changed. All you need to unlock your Escrow is the Transaction Hash associated with the Escrow Creation, The Fulfillment ID we provided to you, and the secret key to any XRP wallet with at least enough available funds to pay for the network fee (Usually around 0.001 XRP).

This application creates a transaction blob that is transmitted to Ripple's public server. This means your Secret Key is never transmitted across the internet, it is just used within this app to sign the transaction. 

This app is open source so feel free to inspect the code and provide feedback.

## Download SBC's Escrow Release Tool for Windows or OSX Below!
[Escrow Release Tool for Windows](https://github.com/SecureBlockChains/SBCEscrowReleaseTool/releases/download/1.0.0/SBC.Escrow.Release.Tool.Setup.1.0.0.exe "Escrow Release for Windows")

[Escrow Release Tool for OSX](https://github.com/SecureBlockChains/SBCEscrowReleaseTool/releases/download/1.0.0/SBC.Escrow.Release.Tool-1.0.0.dmg "Escrow Release for Windows")


### Customizing
This is an electron app. If you decide to customize anything in the code, reference Electron's documentation for packaging.

If you need to change the server do so on line 5 of escrowRelease.js

