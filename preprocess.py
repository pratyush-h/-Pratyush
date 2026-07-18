import importlib.util
from pathlib import Path


def _load_real_module():
    module_path = Path(__file__).with_name("preprocess (1).py")
    spec = importlib.util.spec_from_file_location("preprocess_real", module_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Unable to load preprocessing module from {module_path}")

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


_real_module = _load_real_module()

load_data = _real_module.load_data
clean_text = _real_module.clean_text
preprocess_text = _real_module.preprocess_text
prepare_data = _real_module.prepare_data
create_features = _real_module.create_features
preprocess_pipeline = _real_module.preprocess_pipeline

__all__ = [
    "load_data",
    "clean_text",
    "preprocess_text",
    "prepare_data",
    "create_features",
    "preprocess_pipeline",
]
