import logging

from settings import SettingsManager

logging.basicConfig(
  filename="/tmp/custom-library-tabs.log",
  format='[CustomLibraryTabs] %(asctime)s %(levelname)s %(message)s',
  filemode='w+',
  force=True)
logger = logging.getLogger()
logger.setLevel(
  logging.INFO)  # can be changed to logging.DEBUG for debugging issues


class Plugin:
  settings: SettingsManager

  # A normal method. It can be called from JavaScript using call_plugin_function("method_1", argument1, argument2)
  async def add(self, left, right):
    return left + right

  # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
  async def _main(self):
    logger.info("Hello World!")

  # Function called first during the unload process, utilize this to handle your plugin being removed
  async def _unload(self):
    logger.info("Goodbye World!")
    pass
