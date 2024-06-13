if [ -d "../renderspace" ]; then
  rm -r ../renderspace
fi
if [ -d "../../web/extensions/renderspace" ]; then
  rm -r ../../web/extensions/renderspace
fi
mv custom_nodes/renderspace ../
mv web/extensions/renderspace ../../web/extensions/