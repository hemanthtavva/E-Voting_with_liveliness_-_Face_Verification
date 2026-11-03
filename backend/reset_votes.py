"""
Reset all votes in the system.
This script will:
1. Clear all votes from the blockchain (PostgreSQL)
2. Reset all voters' has_voted status to False
"""

import json
import psycopg2
from pathlib import Path

def reset_votes():
    """Reset all votes in the system."""
    
    # 1. Reset voters.json - set all has_voted to False
    voters_file = Path(__file__).parent.parent / "data" / "voters.json"
    
    if voters_file.exists():
        try:
            with open(voters_file, 'r') as f:
                voters_db = json.load(f)
            
            # Reset has_voted for all voters
            for aadhaar, info in voters_db.items():
                voters_db[aadhaar]["has_voted"] = False
                if "voted_at" in voters_db[aadhaar]:
                    del voters_db[aadhaar]["voted_at"]
            
            with open(voters_file, 'w') as f:
                json.dump(voters_db, f, indent=2)
            
            print(f"✅ Reset {len(voters_db)} voters' has_voted status to False")
        except Exception as e:
            print(f"❌ Error resetting voters.json: {e}")
    else:
        print(f"⚠️ voters.json not found at {voters_file}")
    
    # 2. Clear votes.json file (used by Results page)
    votes_file = Path(__file__).parent.parent / "data" / "votes.json"
    
    if votes_file.exists():
        try:
            # Clear all votes - set to empty array
            with open(votes_file, 'w') as f:
                json.dump([], f, indent=2)
            
            print(f"✅ Cleared votes.json file")
        except Exception as e:
            print(f"❌ Error clearing votes.json: {e}")
    else:
        print(f"⚠️ votes.json not found at {votes_file}")
    
    # 3. Clear blockchain votes from PostgreSQL
    try:
        conn = psycopg2.connect("dbname=voting_system")
        cur = conn.cursor()
        
        # Delete all blocks except genesis block (block_index = 0)
        cur.execute("DELETE FROM blockchain WHERE block_index > 0")
        deleted_count = cur.rowcount
        
        conn.commit()
        cur.close()
        conn.close()
        
        print(f"✅ Deleted {deleted_count} vote blocks from blockchain")
        print("✅ Genesis block preserved")
    except Exception as e:
        print(f"❌ Error clearing blockchain: {e}")
        print("Note: Make sure PostgreSQL is running and voting_system database exists")
    
    print("\n🎉 Vote reset complete!")
    print("All voters can now vote again.")

if __name__ == "__main__":
    print("🔄 Resetting all votes...")
    print("=" * 50)
    reset_votes()
