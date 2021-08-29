"""empty message

Revision ID: ad29ca906c41
Revises: de80e08c5d54
Create Date: 2021-08-29 15:07:59.783518

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ad29ca906c41'
down_revision = 'de80e08c5d54'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('shop_content', schema=None) as batch_op:
        batch_op.add_column(sa.Column('prices', sa.Float(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('shop_content', schema=None) as batch_op:
        batch_op.drop_column('prices')

    # ### end Alembic commands ###