# Cinnamon applet utilitary for Connect or Disconnect from a VPN network using snx program.

## Simple applet for simplify the use of snx cli program.

This applet needs the following requirements:
- snx program
- expect program
- a VPN user keystore (pkcs12 file)
- the script snx_connect (in the scripts directory) be copyied to /usr/local/bin or other global path and have execute permission (+x).

Change the snx_connect script with your VPN keystore passphrase, path and remote VPN server.

The **snx_connect** script use **expect** program to type your pass directly into terminal to automate the connection process.
