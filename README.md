# Cinnamon applet utilitary for Connect or Disconnect from a VPN network using snx program.

## Simple applet for simplify the use of snx cli program.

This applet needs the following requirements:
- snx program
- expect program
- a VPN user keystore (pkcs12 file)
- in the scripts directory, rename **snx_connect.sample** to **snx_connect** and give execute permission (+x).
- change the **snx_connect** script with your VPN keystore path, passphrase and remote VPN server.

The **snx_connect** script use **expect** program to type your pass directly into terminal to automate the connection process.
Make sure you have expect program installed. (sudo apt-get install expect).

To install the applet in Cinnamon just copy the folder to ~/.local/share/cinnamon/applets. 
Rename the folder to snx@elvisvasc
