table "new_user" , :rename_to => "user" do
  column "userid", :key
  column "username", :string
end

table "new_forum" , :rename_to => "forum" do
  column "forumid", :key
  column "title", :string
end

table "new_post", :rename_to => "post" do
  column "postid", :key
  column "threadid", :integer, :references => :thread
  column "userid", :integer, :references => :user
  column "title", :string
  column "date", :timestamps
  column "content", :text
end


table "new_thread", :rename_to => "thread" do
  column "threadid", :key
  column "title", :string
  column "forumid", :integer, :references => :forum
end
