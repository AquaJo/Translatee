// just a script to sync the plugin from the main directory linked to the git history of Vencord
import "dotenv/config";
import { exec } from "child_process";
import fs from "fs";
// Define source and destination paths
const sourceDir = process.env.MAINDIR; // Update this to your source directory
const destinationDir = "./translatee"; // Destination in the script directory

// Function to execute a shell command
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Main function to sync directories
async function syncDirectories() {
  try {
    // Remove the destination directory if it exists
    if (
      fs.existsSync(destinationDir) &&
      fs.lstatSync(destinationDir).isDirectory()
    ) {
      console.log(`Deleting existing destination directory: ${destinationDir}`);
      await executeCommand(`rm -rf "${destinationDir}"`);
    }

    // Copy the source directory to the destination directory
    console.log(
      `Copying source directory to destination directory: ${sourceDir} -> ${destinationDir}`
    );
    await executeCommand(`cp -r "${sourceDir}" "${destinationDir}"`);

    console.log("Directory synchronization complete.");
  } catch (error) {
    console.error("Error during directory synchronization:", error);
  }
}

// Run the syncDirectories function
syncDirectories();
