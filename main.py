import logging
from typing import Any, Dict

from settings import SettingsManager

logging.basicConfig(
  filename="/tmp/custom-library-tabs.log",
  format='[CustomLibraryTabs] %(asctime)s %(levelname)s %(message)s',
  filemode='w+',
  force=True)
logger = logging.getLogger()
logger.setLevel(logging.INFO)

Initialized = False


class Result:
  def __init__(self, success: bool, message: str = "Success"):
    self.success = success
    self.message = message

    if not self.success:
      logger.info(f"Result failed! {message}")

  def raise_on_failure(self):
    if not self.success:
      raise Exception(self.message)

  def to_dict(self):
    return {"success": self.success, "message": self.message}


class Plugin:
  settings: SettingsManager

  async def _main(self):
    Plugin.settings = SettingsManager("custom-library-tabs")
    await Plugin.read(self)

  async def _unload(self):
    pass

  async def read(self) -> Dict[str, Any]:
    try:
      Plugin.settings.read()
    except Exception as e:
      return Result(False, str(e)).to_dict()
    else:
      return Result(True).to_dict()

  async def commit(self) -> Dict[str, Any]:
    try:
      Plugin.settings.commit()
    except Exception as e:
      return Result(False, str(e)).to_dict()
    else:
      return Result(True).to_dict()

  async def getSetting(self, key: str, default) -> Dict[str, Any]:
    try:
      setting = Plugin.settings.getSetting(key, default)
    except Exception as e:
      return Result(False, str(e)).to_dict()
    else:
      return setting

  async def setSetting(self, key: str, value) -> Dict[str, Any]:
    try:
      Plugin.settings.setSetting(key, value)
    except Exception as e:
      return Result(False, str(e)).to_dict()
    else:
      return Result(True).to_dict()
