/**
 * Applet for Connect or Disconnet from a VPN using snx client for Linux.
 *
 * Cinnamon applet documentation: 
 *   http://lira.epac.to:8080/doc/cinnamon/cinnamon-js
 *   https://projects.linuxmint.com/reference/git/cinnamon-tutorials/write-applet.html
 *
 * @author Elvis Cunha - Brasília - DF - Brazil
 */

const Applet = imports.ui.applet;
const St = imports.gi.St;
const PopupMenu = imports.ui.popupMenu;
const Util = imports.misc.util;

const notificationDuration = '2000';
const notificationTitle = 'SNX Connect Util';

function notify(message) {
    Util.spawnCommandLine("kill $(pgrep ^notify-osd$)");
    Util.spawn_async(["notify-send", "--hint=int:transient:1",  "-t", notificationDuration, `${notificationTitle}`, `${message}`]);
}

class MyApplet extends Applet.IconApplet {
    constructor(metadata, orientation, panelHeight, instanceId) {
        super(orientation, panelHeight, instanceId);

        this.metadata = metadata;
        this.orientation = orientation;
    
        Applet.IconApplet.prototype._init.call(this, this.orientation, panelHeight, instanceId);

        this.buildMenu = this.buildMenu.bind(this);
        this.connectToVPN = this.connectToVPN.bind(this);
        this.disconnectFromVPN = this.disconnectFromVPN.bind(this);
        this.setIcon = this.setIcon.bind(this);
        this.verifySNXIsRunning = this.verifySNXIsRunning.bind(this);

        this.set_applet_icon_symbolic_name("channel-insecure-symbolic");

        this.isConnected = false;

        this.verifySNXIsRunning();

        this.menuManager = new PopupMenu.PopupMenuManager(this);
        this.menu = new Applet.AppletPopupMenu(this, orientation);

        this.menuManager.addMenu(this.menu);
        this.buildMenu();
    }

    on_applet_clicked() {
        this.menu.toggle();
    }

    buildMenu() {
        this.menu.removeAll();

        if (this.isConnected) {
            let disconnectMenuItem = new PopupMenu.PopupIconMenuItem(_("Disconnect from VPN"), "channel-insecure-symbolic", St.IconType.SYMBOLIC);
            disconnectMenuItem.connect("activate", this.disconnectFromVPN);
            this.menu.addMenuItem(disconnectMenuItem);
  	    this.set_applet_tooltip(_('Click to disconnect from VPN'));
        } else {
            let connectMenuItem = new PopupMenu.PopupIconMenuItem(_("Connect to VPN"), "channel-secure-symbolic", St.IconType.SYMBOLIC);
            connectMenuItem.connect("activate", this.connectToVPN);
            this.menu.addMenuItem(connectMenuItem);
            this.set_applet_tooltip(_('Click to connect to VPN'));		
        }
    }

    connectToVPN() {
        global.log("Connecting to VPN ...");
        this.setIcon("loading");
        notify("Connecting to VPN ...");

	let connectScript = this.metadata.path + "/scripts/snx_connect";

        Util.spawnCommandLineAsync(`gnome-terminal -- ${connectScript}`, () => {
            this.setIcon("connected");
            notify("Succefully connected to VPN!");
            this.isConnected = true;
            this.buildMenu();
        },
        () => {
            this.setIcon("disconnected");
            notify("Error while conneting...");
        });
    }

    disconnectFromVPN() {
        global.log("Disconnecting from VPN ...");
        this.setIcon("loading");
        notify("Disconnecting from VPN...");

        Util.spawnCommandLineAsync("snx -d", () => {
            this.setIcon("disconnected");
            notify("Disconnected from VPN.");
            this.isConnected = false;
            this.buildMenu();
        },
         () => { 
            this.setIcon("connected");
            notify("Error while disconneting...");
        });
    }

    verifySNXIsRunning() {

      Util.spawn_async(["pgrep", "-x", "snx"], (result) => {
        this.setIcon("connected");
        this.isConnected = true;
        this.buildMenu();
      });
    }       

    setIcon(type) {
        let currentIcon = "";
    
        switch (type) {
            case "loading":
                currentIcon = "rotation-locked-symbolic";
                break;
            case "connected": 
                currentIcon = "changes-prevent-symbolic"
                break;

            case "disconnected":
            default:
                currentIcon = "channel-insecure-symbolic";
        }


        this.set_applet_icon_symbolic_name(currentIcon);
    }

}


function main(metadata, orientation, panelHeight, instanceId) {
    let myApplet = new MyApplet(metadata, orientation, panelHeight, instanceId);
    return myApplet;
}

