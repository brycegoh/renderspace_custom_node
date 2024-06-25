if [ -d "../renderspace" ]; then
  rm -r ../renderspace
fi
if [ -d "../../web/extensions/renderspace" ]; then
  rm -r ../../web/extensions/renderspace
fi
cp custom_nodes/renderspace ../
cp web/extensions/renderspace ../../web/extensions/