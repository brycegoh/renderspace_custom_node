if [ -d "../renderspace" ]; then
  rm -r ../renderspace
fi
if [ -d "../../web/extensions/renderspace" ]; then
  rm -r ../../web/extensions/renderspace
fi
cp -r custom_nodes/renderspace ../
cp -r web/extensions/renderspace ../../web/extensions/